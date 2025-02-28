const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkBlacklist = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Kein Token vorhanden" });
    }

    // Prüfen, ob Token in der Blacklist ist (fix: findFirst() statt findUnique())
    const blacklisted = await prisma.blacklistedToken.findFirst({
      where: { token },
    });

    if (blacklisted) {
      return res.status(403).json({ message: "Dieses Token ist gesperrt. Bitte neu anmelden." });
    }

    next();
  } catch (error) {
    console.error("Fehler bei der Token-Überprüfung:", error);
    res.status(500).json({ message: "Fehler bei der Token-Überprüfung" });
  }
};

module.exports = checkBlacklist;
