require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const csrfProtection = require("./middleware/csrfMiddleware");
const authRoutes = require("./routes/authRoutes");
const cleanupExpiredTokens = require("./utils/cleanupBlacklist");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Sichere CORS-Konfiguration
const allowedOrigins = ["http://localhost:3000", "https://mein-frontend.de"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS-Fehler: Zugriff verweigert"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Cookies erlauben
};

// 📌 CORS **vor** allen anderen Middleware aktivieren
app.use(cors(corsOptions));

// 📌 Sicherheits-Middleware
app.use(express.json());
app.use(cookieParser()); // Cookies parsen
app.use(helmet()); // Sicherheits-Header setzen
app.use(morgan("dev")); // Logging
app.use(xssClean()); // Schutz vor XSS-Angriffen

// 📌 CSRF-Schutz nach CORS aktivieren
app.use(csrfProtection); // CSRF-Schutz aktivieren

// ✅ CSRF-Token Endpunkt (nur für erlaubte Domains)
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 📌 Routen registrieren
app.use("/api/auth", authRoutes);

// Test-Route
app.get("/", (req, res) => {
  res.send("✅ Backend läuft! 🚀");
});



// 🔥 Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});

// Bereinigt das Tokendatenbank
//cleanupExpiredTokens(); // Einmalig beim Start aufrufen lösch die unnötigen tokens in der datenbank