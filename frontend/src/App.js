// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import WelcomePage from "./pages/WelcomePage";
import AdminPage from "./pages/AdminPage";
import SupervisorPage from "./pages/SupervisorPage";
import UserPage from "./pages/UserPage";
import Logout from "./pages/Logout";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/welcome"
            element={<ProtectedRoute element={<WelcomePage />} />}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute element={<AdminPage />} requiredRole="admin" />}
          />
          <Route
            path="/supervisor"
            element={<ProtectedRoute element={<SupervisorPage />} requiredRole="supervisor" />}
          />
          <Route
            path="/user"
            element={<ProtectedRoute element={<UserPage />} requiredRole="user" />}
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;