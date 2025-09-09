import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

export default app;
