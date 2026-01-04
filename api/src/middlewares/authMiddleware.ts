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

  if (token !== "fake-jwt-token") {
    return res.status(401).json({ error: "Token inválido" });
  }

 req.user = {
  id: 1,
  companyId: 1,
  role: "ADMIN"
}

  next();
}