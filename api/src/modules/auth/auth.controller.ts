import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = jwt.sign(
    { id: user.id, role: user.role, companyId: user.companyId },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id
    }
  });

  return res.json({
    accessToken,
    refreshToken
  });
}