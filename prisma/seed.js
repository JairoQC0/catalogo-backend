import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
}

main()
  .then(() => {
    console.log("Seed completado");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
