const express = require("express");
const { register, login, logout, requestOTP, verifyOTP } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { loginLimiter, otpLimiter } = require("../middleware/rateLimiter");
const { validateLogin, validateRegister } = require("../middleware/validation");
const checkBlacklist = require("../middleware/tokenBlacklistMiddleware");


const router = express.Router();


// Registrierung
router.post("/register", validateRegister, register);

// Login
router.post("/login", validateLogin, loginLimiter, login);

// Logout
router.post("/logout", authMiddleware, checkBlacklist, logout);



// Geschützte Route (nur für eingeloggte Benutzer)
router.get("/protected", authMiddleware, checkBlacklist, (req, res) => {
  try {
    res.json({ message: "Willkommen in der geschützten Route!", user: req.user });
  } catch (error) {
    console.error("Fehler in der geschützten Route:", error);
    res.status(500).json({ message: "Fehler in der geschützten Route", error });
  }
});

// OTP anfordern
router.post("/request-otp", otpLimiter, requestOTP);
router.post("/verify-otp", verifyOTP);




module.exports = router;