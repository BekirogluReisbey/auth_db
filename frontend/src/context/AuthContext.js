// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Benutzerstatus beim Start prüfen
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🟢 Benutzer geladen:", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("🔴 Fehler beim Laden des Benutzers:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);



  // 🔵 Login-Funktion
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        alert("Bitte geben Sie eine E-Mail und ein Passwort ein.");
        return;
      }

      console.log("🔵 Login wird ausgeführt mit:", email, password);
      

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("🟢 Antwort vom Server:", res.data);

      if (res.status === 200) {
        console.log("🔵 Speichere Token in localStorage:", res.data.token);
        localStorage.setItem("token", res.data.token);
        console.log("🟢 Token gespeichert:", localStorage.getItem("token"));

        setUser(res.data.user);
        setLoading(false);

        // Weiterleitung basierend auf der Rolle
        switch (res.data.user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "supervisor":
            navigate("/supervisor");
            break;
          case "user":
            navigate("/user");
            break;
          default:
            navigate("/welcome");
            break;
        }
      }
    } catch (error) {
      console.error("🔴 Fehler beim Login:", error);
      alert("Login fehlgeschlagen: " + (error.response?.data?.message || "Serverfehler"));
      setLoading(false);
    }
  };

  // 🔴 Logout-Funktion
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log("🟢 Logout erfolgreich");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("🔴 Fehler beim Logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
