import { Router, Request, Response } from "express";
import { authorize } from "../middlewares/authorize";
import { authMiddleware } from "../middlewares/authMiddleware";
import prisma from "../lib/prisma";

const router = Router();

function companyScope(companyId: number) {
  return { companyId };
}

router.get(
  "/",
  authMiddleware,
  authorize(["ADMIN", "MANAGER", "MEMBER"]),
  async (req: Request, res: Response) => {
    const { companyId } = req.user!;

    const projects = await prisma.project.findMany({
      where: companyScope(companyId),
      orderBy: { createdAt: "desc" }
    });

    return res.json(projects);
  }
);

router.post(
  "/",
  authMiddleware,
  authorize(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    const { companyId } = req.user!;
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        status: "ACTIVE",
        companyId
      }
    });

    return res.status(201).json(project);
  }
);

router.get(
  "/:id",
  authMiddleware,
  authorize(["ADMIN", "MANAGER", "MEMBER"]),
  async (req: Request, res: Response) => {
    const { companyId } = req.user!;
    const projectId = Number(req.params.id);

    if (Number.isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ...companyScope(companyId)
      },
      include: {
        tasks: true
      }
    });

    if (!project) {
      return res.status(404).json({ error: "Not found" });
    }

    const totalTasks = project.tasks.length;
    const doneTasks = project.tasks.filter(
      t => t.status === "DONE"
    ).length;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round((doneTasks / totalTasks) * 100);

    const tasks = project.tasks.map(task => ({
      ...task,
      status:
        task.status !== "DONE" &&
        task.dueDate &&
        task.dueDate < new Date()
          ? "OVERDUE"
          : task.status
    }));

    return res.json({
      id: project.id,
      name: project.name,
      status: project.status,
      progress,
      tasks
    });
  }
);

export default router;
