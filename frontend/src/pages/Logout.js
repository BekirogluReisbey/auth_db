// Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // Token entfernen
    setAuth(false);
    navigate("/"); // Zur Login-Seite weiterleiten
  }, [navigate, setAuth]);

  return <p>Logging out...</p>;
};

export default Logout;
