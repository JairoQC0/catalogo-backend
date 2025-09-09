import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import catalogRoutes from "./routes/catalog.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

// CORS para tu frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routers
app.use("/catalogs", catalogRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Servir frontend (opcional)
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
