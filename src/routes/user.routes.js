import { Router } from "express";
import { getProfile, adminPanel } from "../controllers/user.controller.js";
import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/admin", authMiddleware, authorizeRole("ADMIN"), adminPanel);

export default router;
