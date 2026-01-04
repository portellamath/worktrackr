import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        companyId: number;
        role: "ADMIN" | "MANAGER" | "MEMBER";
      };
    }
  }
}

export {};