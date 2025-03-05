import axios from "axios";
import { getCsrfToken } from "../utils/csrf"; // CSRF-Token abrufen

export async function login(email, password) {
  try {
    // 📌 Hole den CSRF-Token **nur wenn nötig**
    const csrfToken = await getCsrfToken();
    console.log("🔑 Erhaltener CSRF-Token:", csrfToken); // Debugging

    console.log("📩 Sende Login-Daten:", { email, password }); // Debugging

    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // CSRF-Token im Header setzen
        },
        withCredentials: true, // Cookies mit übermitteln (wichtig für CSRF!)
      }
    );

    console.log("✅ Login erfolgreich:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Fehler beim Login:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
