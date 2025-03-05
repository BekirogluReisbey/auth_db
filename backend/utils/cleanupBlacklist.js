const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cleanupExpiredTokens = async () => {
  try {
    const now = new Date();
    

    
    // Verwenden der korrekten Modellreferenz (bei Prisma ist es normalerweise camelCase)
    await prisma.blacklistToken.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });
    console.log("✅ Abgelaufene Tokens wurden entfernt.");
  } catch (error) {
    console.error("❌ Fehler beim Bereinigen der Blacklist:", error);
  } finally {
    // Sauberes Beenden der Prisma-Verbindung
    await prisma.$disconnect();
  }
};

// Cleanup alle 24 Stunden ausführen
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);

module.exports = cleanupExpiredTokens;