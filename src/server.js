import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import catalogRoutes from "./routes/catalog.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import packageRoutes from "./routes/package.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Routers
app.use("/catalogs", catalogRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/packages", packageRoutes);

// Puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
