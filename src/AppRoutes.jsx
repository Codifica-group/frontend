import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardEleve from "./pages/Dashboard";
import Historico from "./pages/Historico";
import Agenda from "./pages/Agenda";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardEleve />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/agenda" element={<Agenda />} />
    </Routes>
  );
}