import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// GET todos os projetos da empresa do usuário
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

// POST criar novo projeto
router.post(
  "/",
  authMiddleware,
  authorize(["ADMIN", "MANAGER"]),
  (req, res) => {
    res.status(201).json({ message: "Project created" });
  }
);

// GET detalhes de um projeto específico + progresso das tarefas
router.get(
  "/:id",
  authMiddleware,
  authorize(["ADMIN", "MANAGER", "MEMBER"]),
  (req, res) => {
    const companyId = req.user!.companyId;
    const projectId = Number(req.params.id);

    const tasks = [
      { id: 1, projectId: 1, status: "DONE", dueDate: new Date("2024-01-01") },
      { id: 2, projectId: 1, status: "TODO", dueDate: new Date("2023-01-01") }
    ];

    const projectTasks = tasks.filter(t => t.projectId === projectId);

    const total = projectTasks.length;
    const done = projectTasks.filter(t => t.status === "DONE").length;

    const progress = total === 0 ? 0 : Math.round((done / total) * 100);

    res.json({
      id: projectId,
      progress,
      tasks: projectTasks.map(task => ({
        ...task,
        status:
          task.status !== "DONE" && task.dueDate < new Date()
            ? "OVERDUE"
            : task.status
      }))
    });
  }
);

export default router;