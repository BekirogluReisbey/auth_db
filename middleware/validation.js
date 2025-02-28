const { check, validationResult } = require("express-validator");

// Middleware zur Validierung von Login-Daten
exports.validateLogin = [
  check("email").isEmail().withMessage("Ungültige E-Mail-Adresse"),
  check("password").isLength({ min: 6 }).withMessage("Passwort muss mindestens 6 Zeichen lang sein"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware zur Validierung der Registrierung
exports.validateRegister = [
  check("email").isEmail().withMessage("Ungültige E-Mail-Adresse"),
  check("password").isLength({ min: 6 }).withMessage("Passwort muss mindestens 6 Zeichen lang sein"),
  //check("name").notEmpty().withMessage("Name darf nicht leer sein"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
