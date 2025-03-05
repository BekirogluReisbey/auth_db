require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const csrf = require("csurf");

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
  methods: "GET,POST,PUT,DELETE,OPTIONS", // OPTIONS explizit erlauben
  allowedHeaders: "Content-Type,Authorization,X-CSRF-Token",
  credentials: true,
  optionsSuccessStatus: 204, // Standardantwort für Preflight-Anfragen
};

// 📌 CORS **vor** allen anderen Middleware aktivieren
app.use(cors(corsOptions));

// 📌 Behandle OPTIONS-Anfragen explizit (Preflight-Fix)
app.options("*", cors(corsOptions));

// 📌 Sicherheits-Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(xssClean());

// ✅ CSRF-Schutz für den Token-Endpunkt
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  },
});

// 📌 Diese Route gibt den CSRF-Token ans Frontend zurück
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 📌 CSRF-Schutz wird **NUR** in `authRoutes.js` für `/login` gesetzt
app.use("/api/auth", authRoutes);

// Test-Route
app.get("/", (req, res) => {
  res.send("✅ Backend läuft! 🚀");
});

// 🔥 Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
