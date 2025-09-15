// src/routes/catalog.routes.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  authMiddleware,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const prisma = new PrismaClient();
const router = Router();

// Crear catálogo (solo ADMIN)
router.post("/", authMiddleware, authorizeRole("ADMIN"), async (req, res) => {
  const { name } = req.body;
  try {
    const catalog = await prisma.catalog.create({ data: { name } });
    res.json(catalog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar catálogos con servicios y paquetes (público)
router.get("/", async (req, res) => {
  try {
    const catalogs = await prisma.catalog.findMany({
      include: {
        services: true,
        packages: {
          include: { services: true }, // 👈 también devolvemos los paquetes y sus servicios
        },
      },
    });
    res.json(catalogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un catálogo con servicios y paquetes (público)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const catalog = await prisma.catalog.findUnique({
      where: { id: Number(id) },
      include: {
        services: true,
        packages: {
          include: { services: true },
        },
      },
    });

    if (!catalog) {
      return res.status(404).json({ message: "Catálogo no encontrado" });
    }

    res.json(catalog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar catálogo (solo ADMIN)
router.put("/:id", authMiddleware, authorizeRole("ADMIN"), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const catalog = await prisma.catalog.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(catalog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar catálogo (solo ADMIN)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.catalog.delete({ where: { id: Number(id) } });
      res.json({ message: "Catálogo eliminado" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Crear servicio dentro de catálogo (solo ADMIN)
router.post(
  "/:catalogId/services",
  authMiddleware,
  authorizeRole("ADMIN"),
  async (req, res) => {
    const { catalogId } = req.params;
    const { name, description, price } = req.body;
    try {
      const service = await prisma.service.create({
        data: {
          name,
          description,
          price: Number(price),
          catalogId: Number(catalogId),
        },
      });
      res.json(service);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Actualizar servicio (solo ADMIN)
router.put(
  "/services/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    try {
      const service = await prisma.service.update({
        where: { id: Number(id) },
        data: { name, description, price: Number(price) },
      });
      res.json(service);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Eliminar servicio (solo ADMIN)
router.delete(
  "/services/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.service.delete({ where: { id: Number(id) } });
      res.json({ message: "Servicio eliminado" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;
