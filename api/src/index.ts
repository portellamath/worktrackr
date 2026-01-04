import express from "express";
import cors from "cors";
import projectsRoutes from "./routes/projects";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// login fake (apenas dev)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@worktrackr.com" && password === "123456") {
    return res.json({
      token: "fake-jwt-token",
      user: {
        id: 1,
        name: "Admin",
        email,
        companyId: 42,
        role: "ADMIN"
      }
    });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});

// 🔥 MONTA O DOMÍNIO
app.use("/projects", projectsRoutes);

// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});