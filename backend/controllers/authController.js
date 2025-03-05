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

  // Sicherstellen, dass die Rolle als Option im Request-Body vorhanden ist
  const { email, password, role = "user" } = req.body; // Default-Wert "user" wenn keine Rolle angegeben ist

  try {
    // Prüfen, ob der Benutzer existiert
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits registriert!" });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await prisma.role.findUnique({ where: { name: role } });
    console.log("🔍 Gefundene Rolle:", userRole);
    
    if (!userRole) {
      return res.status(400).json({ message: "Ungültige Rolle!" });
    }

    // Benutzer in der Datenbank speichern
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: userRole.id,
      },
    });

    res.status(201).json({ message: "Registrierung erfolgreich!", userId: newUser.id });
  } catch (error) {
    console.error("❌ Fehler beim Registrieren:", error);
    res.status(500).json({ 
      message: "Fehler beim Registrieren",
      error: error.message || error.toString() || "Unbekannter Fehler" 
    });
  }
};


// Benutzer einloggen
exports.login = async (req, res) => {
  console.log("➡️ Login-Request Body:", req.body); // 🟢 Loggt die empfangenen Daten
  const { email, password } = req.body;

  try {
    // 🔍 Überprüfen, ob der Benutzer existiert
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("🔍 Gefundener Benutzer:", user); // 🟢 Zeigt den gefundenen Benutzer

    if (!user) {
      console.log("❌ Kein Benutzer mit dieser E-Mail gefunden!");
      return res.status(400).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    // 🔑 Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Passwort korrekt?", isMatch); // 🟢 Zeigt, ob das Passwort stimmt

    if (!isMatch) {
      console.log("❌ Passwort stimmt nicht!");
      return res.status(400).json({ message: "Ungültige E-Mail oder Passwort" });
    }

    // 🔐 JWT-Token erstellen
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login erfolgreich! Token:", token);
    res.json({ message: "Login erfolgreich", token });
  } catch (error) {
    console.error("🔥 Fehler beim Login:", error);
    res.status(500).json({ message: "Fehler beim Login", error });
  }
};



// Logout (Token zur Blacklist hinzufügen)
exports.logout = async (req, res) => {
  try {
    console.log("🔍 Logout gestartet...");

    const token = req.headers.authorization?.split(" ")[1];
    console.log("🔑 Erhaltener Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Kein Token vorhanden" });
    }

    const decodedToken = jwt.decode(token);
    console.log("📜 Dekodiertes Token:", decodedToken);

    if (!decodedToken || !decodedToken.exp) {
      return res.status(400).json({ message: "Ungültiges Token" });
    }

    const expirationDate = new Date(decodedToken.exp * 1000);
    console.log("📅 Ablaufdatum des Tokens:", expirationDate);

    // Token in die Blacklist speichern
    await prisma.blacklistedToken.create({
      data: {
        token: token,
        expiresAt: expirationDate,
      },
    });

    console.log("✅ Token erfolgreich auf Blacklist gesetzt!");
    res.json({ message: "Logout erfolgreich" });
  } catch (error) {
    console.error("❌ Fehler beim Logout:", error);
    res.status(500).json({ message: "Fehler beim Logout", error });
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

