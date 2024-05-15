import { RefreshToken, User } from "@prisma/client";
import { db } from "../../../db";
import { hashToken } from "../../../utils/hashToken";

export function addRefreshTokenToWhitelist({
  jti,
  refreshToken,
  userId,
}: {
  jti: string;
  refreshToken: string;
  userId: User["id"];
}) {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

export function findRefreshTokenById(id: RefreshToken["id"]) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

export function deleteRefreshToken(id: RefreshToken["id"]) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

export function revokeTokens(userId: User["id"]) {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}
