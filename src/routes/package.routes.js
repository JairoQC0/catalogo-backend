import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const prisma = new PrismaClient();
const router = Router();

// Listar paquetes
router.get("/", async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: { services: true, catalog: true },
    });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear paquete (solo ADMIN)
router.post("/", authMiddleware, authorizeRole("ADMIN"), async (req, res) => {
  const { name, description, price, catalogId, serviceIds } = req.body;

  try {
    const catalog = await prisma.catalog.findUnique({
      where: { id: Number(catalogId) },
    });
    if (!catalog) {
      return res.status(404).json({ error: "El catálogo no existe" });
    }

    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        catalogId: Number(catalogId),
      },
    });

    if (services.length !== serviceIds.length) {
      return res.status(400).json({
        error: "Uno o más servicios no existen o no pertenecen a este catálogo",
      });
    }

    const newPackage = await prisma.package.create({
      data: {
        name,
        description,
        price: Number(price),
        catalogId: Number(catalogId),
        services: {
          connect: serviceIds.map((id) => ({ id })),
        },
      },
      include: { services: true, catalog: true },
    });

    res.json(newPackage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
