const rateLimit = require("express-rate-limit");

//Begrenzung für Login-Versuche (max. 5 Versuche in 15 Minuten)
exports.loginLimiter = rateLimit({
  windowMs: 30 * 1000,//15 * 60 * 1000, // 15 Minuten
  max: 15, // Maximal 5 Versuche
  message: "Zu viele fehlgeschlagene Anmeldeversuche, bitte warte 15 Minuten.",
  headers: true,
  handler: (req, res, next) => {
    console.log("Rate Limiter triggered for login");
    res.status(429).json({ message: "Zu viele fehlgeschlagene Anmeldeversuche, bitte warte 15 Minuten." });
  },
});

// Begrenzung für OTP-Anfragen (max. 3 pro Stunde)
exports.otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  max: 3, // Maximal 3 Versuche
  message: "Zu viele OTP-Anfragen, bitte versuche es später erneut.",
  headers: true,
});
