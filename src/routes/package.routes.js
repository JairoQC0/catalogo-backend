import { Router } from "express";
import * as packageController from "../controllers/package.controller.js";

const router = Router();

router.post("/", packageController.createPackage);
router.get("/", packageController.getPackages);
router.get("/:id", packageController.getPackageById);
router.put("/:id", packageController.updatePackage);
router.delete("/:id", packageController.deletePackage);

export default router;
