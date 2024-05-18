import * as bcrypt from "bcrypt";
import cuid from "cuid";
import { NextFunction, Request, Response } from "express";
import { TokensResponseInterface } from "../../../interfaces/TokensResponse";
import { hashToken } from "../../../utils/hashToken";
import { generateTokens, verifyRefreshToken } from "../../../utils/jwt";
import { sendRefreshToken } from "../../../utils/sendRefreshToken";
import {
  createUserByEmailAndPassword,
  findUserByEmail,
  findUserById,
} from "../users/users.services";
import {
  LoginInput,
  LoginQuerySchema,
  RefreshInput,
  RegisterInput,
  RegisterQuerySchema,
} from "./auth.schemas";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
} from "./auth.services";

export async function register(
  req: Request<{}, TokensResponseInterface, RegisterInput, RegisterQuerySchema>,
  res: Response<TokensResponseInterface>,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const { refreshTokenInCookie } = req.query;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400);
      throw new Error("Email already in use.");
    }

    const user = await createUserByEmailAndPassword({ email, password });

    const jti = cuid();
    const { accessToken, refreshToken } = generateTokens(user, jti);

    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    if (refreshTokenInCookie === "true") {
      sendRefreshToken(res, refreshToken);
      res.json({
        accessToken: accessToken,
      });
    } else {
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<{}, TokensResponseInterface, LoginInput, LoginQuerySchema>,
  res: Response<TokensResponseInterface>,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const { refreshTokenInCookie } = req.query;

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(401);
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(401);
      throw new Error("Invalid login credentials.");
    }

    const jti = cuid();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
    });

    if (refreshTokenInCookie === "true") {
      sendRefreshToken(res, refreshToken);
      res.json({
        accessToken: accessToken,
      });
    } else {
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function refreshTokens(
  req: Request<{}, TokensResponseInterface, RefreshInput>,
  res: Response<TokensResponseInterface>,
  next: NextFunction
) {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Missing refresh token.");
    }
    const payload = verifyRefreshToken(refreshToken) as {
      userId: string;
      jti: string;
    };

    const savedRefreshToken = await findRefreshTokenById(payload.jti);
    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    const user = await findUserById(payload.userId);

    if (!user) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = cuid();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    );
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    const { refreshTokenInCookie } = req.query;

    if (refreshTokenInCookie === "true") {
      sendRefreshToken(res, newRefreshToken);
      res.json({
        accessToken: accessToken,
      });
    } else {
      res.json({
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      });
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError")
    ) {
      res.status(401);
    }
    next(error);
  }
}
