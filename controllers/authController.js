const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const speakeasy = require("speakeasy");
const { sendOTP } = require("../utils/emailService");
const JWT_SECRET = process.env.JWT_SECRET || "meinSuperGeheimerSchlüssel";



// Benutzer registrieren
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Prüfen, ob der Benutzer existiert
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits registriert!" });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer in der Datenbank speichern
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Registrierung erfolgreich!", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Registrieren", error });
  }
};


// Benutzer einloggen
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    // JWT-Token erstellen
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login erfolgreich", token });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Login", error });
  }
};



// Logout (Token zur Blacklist hinzufügen)
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Kein Token vorhanden" });
    }

    // Ablaufdatum aus Token extrahieren
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const expirationDate = new Date(decodedToken.exp * 1000); // In Millisekunden umrechnen

    // Token in Blacklist speichern
    await BlacklistedToken.create({
      data: {
      token: token,
    },
  });

    res.json({ message: "Logout erfolgreich" });
  } catch (error) {
    console.error("Fehler beim Logout:", error);
    res.status(500).json({ message: "Fehler beim Logout" });
  }
};






// OTP anfordern
exports.requestOTP = async (req, res) => {
  const { email } = req.body;

  const otpCode = speakeasy.totp({
    secret: process.env.OTP_SECRET || "superSecret",
    encoding: "base32",
    step: 300, // 5 Minuten gültig
  });

  await prisma.OTP.create({
    data: {
      email,
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  await sendOTP(email, otpCode);
  res.json({ message: "OTP wurde gesendet" });
};



// OTP verifizieren
exports.verifyOTP = async (req, res) => {
  const { email, code } = req.body;

  const storedOTP = await prisma.OTP.findFirst({
    where: { email, code, expiresAt: { gte: new Date() } },
  });

  if (!storedOTP) {
    return res.status(400).json({ message: "Ungültiges oder abgelaufenes OTP" });
  }

  res.json({ message: "OTP erfolgreich verifiziert!" });
};

