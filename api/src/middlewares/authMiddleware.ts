import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não enviado" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    req.user = {
      id: payload.id,
      companyId: payload.companyId,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}