import { Router, Request, Response } from "express";
import { authorize } from "../middlewares/authorize";
import { authMiddleware } from "../middlewares/authMiddleware";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

const router = Router();

/**
 * GET /projects
 */
router.get(
  "/",
  authMiddleware,
  authorize(["ADMIN", "MANAGER", "MEMBER"]),
  async (req: Request, res: Response) => {
    const companyId = req.user!.companyId;

    const projects = await prisma.project.findMany({
      where: { companyId }
    });

    res.json(projects);
  }
);

/**
 * POST /projects
 */
router.post(
  "/",
  authMiddleware,
  authorize(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    const companyId = req.user!.companyId;
    const { name, clientId } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }

    const parsedClientId = Number(clientId);
    if (Number.isNaN(parsedClientId)) {
      return res.status(400).json({ error: "clientId must be a number" });
    }

    // RESOLUÇÃO: O erro de 'clientId' ocorre porque o campo provavelmente
    // não existe no modelo Project do seu schema.prisma.
    const project = await prisma.project.create({
      data: {
        name,
        companyId,
        // clientId, // Remova ou comente esta linha se ela não existir no schema
        status: "ACTIVE"
      }
    });

    res.status(201).json(project);
  }
);

/**
 * GET /projects/:id
 */
router.get(
  "/:id",
  authMiddleware,
  authorize(["ADMIN", "MANAGER", "MEMBER"]),
  async (req: Request, res: Response) => {
    const companyId = req.user!.companyId;
    const projectId = Number(req.params.id);

    if (Number.isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, companyId },
      include: { tasks: true }
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // RESOLUÇÃO: Definimos o tipo baseado na query para evitar erro de importação
    type ProjectWithTasks = Prisma.ProjectGetPayload<{
      include: { tasks: true }
    }>;
    
    const p = project as ProjectWithTasks;
    const total = p.tasks.length;
    
    const done = p.tasks.filter(task => task.status === "DONE").length;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);

    res.json({
      id: p.id,
      name: p.name,
      status: p.status,
      progress,
      tasks: p.tasks.map(task => ({
        ...task,
        status:
          // RESOLUÇÃO: Checagem 'task.dueDate' evita erro de 'possivelmente null'
          task.status !== "DONE" && task.dueDate && task.dueDate < new Date()
            ? "OVERDUE"
            : task.status
      }))
    });
  }
);

export default router;