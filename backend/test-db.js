const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testDB() {
  try {
    const users = await prisma.user.findMany();
    console.log("✅ Verbindung erfolgreich! Benutzer:", users);
  } catch (error) {
    console.error("❌ Fehler bei der Verbindung:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();
