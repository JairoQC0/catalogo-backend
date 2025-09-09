import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import catalogRoutes from "./routes/catalog.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

// Configuración de CORS para frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Puedes restringir a tu frontend luego
    credentials: true,
  })
);

// Routers
app.use("/catalogs", catalogRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
