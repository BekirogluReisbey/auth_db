const express = require("express");
const { register, login, logout, requestOTP, verifyOTP } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { loginLimiter, otpLimiter } = require("../middleware/rateLimiter");
const { validateLogin, validateRegister } = require("../middleware/validation");
const checkBlacklist = require("../middleware/tokenBlacklistMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { PrismaClient } = require("@prisma/client");
const csrf = require("csurf"); // CSRF importieren

const prisma = new PrismaClient();
const router = express.Router();

// ✅ CSRF-Schutz nur für die Login-Route aktivieren
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  },
});



// Registrierung
router.post("/register", validateRegister, register);

// 🛠 Login-Route mit CSRF-Schutz
router.post("/login", csrfProtection, validateLogin, loginLimiter, async (req, res, next) => {
  console.log("Empfangene Login-Daten:", req.body); // Debugging
  next();
}, login);


// Logout
router.post("/logout", authMiddleware, checkBlacklist, logout);

// Route nur für Admins
router.get("/admin", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({ message: "Willkommen, Admin!" });
});

// Geschützte Route (nur für eingeloggte Benutzer)
router.get("/protected", authMiddleware, checkBlacklist, (req, res) => {
  try {
    res.json({ message: "Willkommen in der geschützten Route!", user: req.user });
  } catch (error) {
    console.error("Fehler in der geschützten Route:", error);
    res.status(500).json({ message: "Fehler in der geschützten Route", error });
  }
});

// ✅ NEU: Route für Benutzerinformationen (authMiddleware prüft, ob der Nutzer eingeloggt ist)
// ✅ Route für Benutzerinformationen
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    res.json(user);
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzers:", error);
    res.status(500).json({ message: "Fehler beim Abrufen des Benutzers", error });
  }
});

// OTP anfordern
router.post("/request-otp", otpLimiter, requestOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
