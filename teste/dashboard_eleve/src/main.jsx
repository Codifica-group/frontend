import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardEleve from "./pages/Dashboard";
import Historico from "./pages/Historico";
import "./styles/style-dashboard.css";
import "./styles/style-historico.css";
import { LoginPage } from "./pages/login";
import Agenda from "./pages/Agenda";
import "./styles/style-agenda.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Rota para tela de login */}
        <Route path="/" element={<LoginPage />} />
        {/* Rota para o Dashboard */}
        <Route path="/dashboard" element={<DashboardEleve />} />
        {/* Rota para o Histórico */}
        <Route path="/historico" element={<Historico />} />
        {/* Rota para a agenda */}
        <Route path="/agenda" element={<Agenda />} />

        
      </Routes>
    </Router>
  </React.StrictMode>
);
