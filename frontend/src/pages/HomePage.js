import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Willkommen {user ? user.email : "Gast"}!</h1>
      {user ? <p>Du bist als {user.role} angemeldet.</p> : <p>Bitte logge dich ein.</p>}
    </div>
  );
};

export default HomePage;
