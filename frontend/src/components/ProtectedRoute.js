// components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user } = useContext(AuthContext); // Annahme: Dein AuthContext gibt den aktuellen Benutzer zurück

  // Wenn kein Benutzer eingeloggt ist, leite zur Login-Seite um
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Wenn eine Rolle erforderlich ist und der Benutzer diese Rolle nicht hat, leite zur Welcome-Seite um
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/welcome" replace />;
  }

  // Andernfalls rendere die gewünschte Komponente
  return element;
};

export default ProtectedRoute;