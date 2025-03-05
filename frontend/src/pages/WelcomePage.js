// WelcomePage.js
import React from "react";
import Navbar from "../components/Navbar";

const WelcomePage = ({ role }) => {
  return (
    <div>
      <Navbar role={role} />
      <h2>Willkommen auf der Seite!</h2>
      <p>Du hast erfolgreich eingeloggt.</p>
    </div>
  );
};

export default WelcomePage;
