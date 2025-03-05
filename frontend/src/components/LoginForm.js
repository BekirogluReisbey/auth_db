import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login } from "../api/auth"; // Importiere die Login-Funktion

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: authLogin } = useContext(AuthContext); // Umbenennen, um Konflikte zu vermeiden
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login(email, password); // Rufe nur email und password auf

      authLogin(userData); // Falls Login erfolgreich war, User in Context speichern
    } catch (err) {
      setError("Login fehlgeschlagen. Überprüfe deine Daten.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <a href="/register">Noch kein Konto? Registrieren</a>
    </div>
  );
};

export default LoginPage;
