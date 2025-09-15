// src/routes/package.routes.js
import { Router } from "express";
import {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/package.controller.js";
import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas para paquetes
router.get("/", getPackages);
router.get("/:id", getPackageById);

router.post("/", authMiddleware, authorizeRole("ADMIN"), createPackage);
router.put("/:id", authMiddleware, authorizeRole("ADMIN"), updatePackage);
router.delete("/:id", authMiddleware, authorizeRole("ADMIN"), deletePackage);

export default router;
