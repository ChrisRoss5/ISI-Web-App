import { Response } from "express";

export function sendRefreshToken(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: true,
    path: "/api/rest/auth",
  });
}
