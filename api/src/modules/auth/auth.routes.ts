import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function logout(req: Request, res: Response) {
  await prisma.refreshToken.updateMany({
    where: {
      userId: req.user!.id,
      revoked: false
    },
    data: {
      revoked: true
    }
  });

  return res.status(204).send();
}
