import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../db.js";
import express from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login exitoso",
    token,
    id: user.id,
    email: user.email,
    role: user.role,
  });
});

export default router;
