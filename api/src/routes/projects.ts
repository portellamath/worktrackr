import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// 🔒 LISTAR PROJETOS (multi-tenant real)
router.get(
  "/",
  authMiddleware,
  authorize(["ADMIN", "MANAGER", "MEMBER"]),
  (req, res) => {
    const companyId = req.user!.companyId;

    const allProjects = [
      { id: 1, name: "Site", companyId: 42 },
      { id: 2, name: "App", companyId: 42 },
      { id: 3, name: "Projeto Hacker", companyId: 99 }
    ];

    const projects = allProjects.filter(
      project => project.companyId === companyId
    );

    res.json(projects);
  }
);

// 🔒 CRIAR PROJETO
router.post(
  "/",
  authMiddleware,
  authorize(["ADMIN", "MANAGER"]),
  (req, res) => {
    res.status(201).json({ message: "Project created" });
  }
);

export default router;
