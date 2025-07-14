import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
export default function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  const jwtSecret = process.env.JWTSECRET as string;
  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.userId = (decoded as JwtPayload).userId;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
    return;
  }
}
