import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPackage = async (req, res) => {
  try {
    const { name, description, price, catalogId, serviceIds } = req.body;

    const newPackage = await prisma.package.create({
      data: {
        name,
        description,
        price,
        catalog: { connect: { id: catalogId } },
        services: {
          connect: serviceIds?.map((id) => ({ id })) || [],
        },
      },
      include: { services: true, catalog: true },
    });

    res.json(newPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPackages = async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: { services: true, catalog: true },
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await prisma.package.findUnique({
      where: { id: Number(id) },
      include: { services: true, catalog: true },
    });
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, serviceIds } = req.body;

    const updated = await prisma.package.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price,
        services: {
          set: serviceIds?.map((id) => ({ id })) || [],
        },
      },
      include: { services: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.package.delete({ where: { id: Number(id) } });
    res.json({ message: "Paquete eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
