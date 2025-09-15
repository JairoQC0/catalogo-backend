// src/controllers/package.controller.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Crear un paquete
 */
export const createPackage = async (req, res) => {
  const { name, description, price, catalogId, serviceIds } = req.body;

  try {
    // 1. Verificar que el catálogo exista
    const catalog = await prisma.catalog.findUnique({
      where: { id: Number(catalogId) },
    });
    if (!catalog) {
      return res.status(404).json({ error: "Catálogo no encontrado" });
    }

    // 2. Verificar que todos los servicios existan y pertenezcan al catálogo
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    const allInCatalog = services.every(
      (s) => s.catalogId === Number(catalogId)
    );
    if (!allInCatalog) {
      return res.status(400).json({
        error: "Todos los servicios deben pertenecer al mismo catálogo",
      });
    }

    // 3. Crear paquete
    const newPackage = await prisma.package.create({
      data: {
        name,
        description,
        price: Number(price),
        catalogId: Number(catalogId),
        services: {
          connect: serviceIds.map((id) => ({ id: Number(id) })),
        },
      },
      include: { services: true, catalog: true },
    });

    res.json(newPackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Listar todos los paquetes
 */
export const getPackages = async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: { services: true, catalog: true },
    });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener un paquete por ID
 */
export const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const pack = await prisma.package.findUnique({
      where: { id: Number(id) },
      include: { services: true, catalog: true },
    });

    if (!pack) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }

    res.json(pack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualizar un paquete
 */
export const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, serviceIds } = req.body;

  try {
    // Verificar que el paquete exista
    const pack = await prisma.package.findUnique({
      where: { id: Number(id) },
    });
    if (!pack) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }

    // Validar servicios (que sean del mismo catálogo que el paquete)
    if (serviceIds && serviceIds.length > 0) {
      const services = await prisma.service.findMany({
        where: { id: { in: serviceIds } },
      });

      const allInCatalog = services.every(
        (s) => s.catalogId === pack.catalogId
      );
      if (!allInCatalog) {
        return res.status(400).json({
          error: "Todos los servicios deben pertenecer al mismo catálogo",
        });
      }
    }

    // Actualizar paquete
    const updated = await prisma.package.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: Number(price),
        services: {
          set: serviceIds?.map((id) => ({ id: Number(id) })) || [],
        },
      },
      include: { services: true, catalog: true },
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar un paquete
 */
export const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.package.delete({ where: { id: Number(id) } });
    res.json({ message: "Paquete eliminado" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
