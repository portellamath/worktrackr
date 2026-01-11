import express from "express";
import cors from "cors";
import projectsRoutes from "./routes/projects";
import authRoutes from "./routes/auth";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// AUTH REAL (JWT)
app.use("/auth", authRoutes);

// ROTAS PROTEGIDAS
app.use("/projects", projectsRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
