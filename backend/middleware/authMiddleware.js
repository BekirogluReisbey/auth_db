const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "meinSuperGeheimerSchlüssel"; // JWT_SECRET hinzufügen

exports.authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Kein Token, Zugriff verweigert" });

  try {
    // Prüfen, ob Token auf der Blacklist ist
    const blacklisted = await prisma.blacklistedToken.findUnique({ where: { token } });
    if (blacklisted) {
      console.log("Token auf der Blacklist gefunden:", token); // Log hinzufügen
      return res.status(401).json({ message: "Token ist ungültig (Logout erfolgt)" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token erfolgreich decodiert:", decoded); // Log hinzufügen
    req.user = decoded;
    console.log("✅ Auth-Middleware: Token validiert, Benutzer-ID:", decoded.userId);

    next();
  } catch (error) {
    console.error("Fehler bei der Token-Validierung:", error); // Log hinzufügen
    res.status(401).json({ message: "Ungültiges Token" });
  }
};