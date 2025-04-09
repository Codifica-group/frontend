import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardEleve from "./pages/Dashboard";
import Historico from "./pages/Historico";
import "./styles/style-dashboard.css";
import "./styles/style-historico.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Rota para o Dashboard */}
        <Route path="/" element={<DashboardEleve />} />
        {/* Rota para o Histórico */}
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
