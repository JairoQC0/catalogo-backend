export const getProfile = (req, res) => {
  res.json({ message: "Perfil del usuario", user: req.user });
};

export const adminPanel = (req, res) => {
  res.json({ message: "Bienvenido Admin" });
};
