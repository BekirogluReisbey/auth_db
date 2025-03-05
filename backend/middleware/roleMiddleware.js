const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const requireRole = (requiredRole) => async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { role: true },
    });

    if (!user || user.role.name !== requiredRole) {
      return res.status(403).json({ message: "Zugriff verweigert: Unzureichende Berechtigungen" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Fehler bei der Rollenprüfung", error });
  }
};

module.exports = requireRole;
