import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardEleve from "./pages/Dashboard";
import Historico from "./pages/Historico";
import Agenda from "./pages/Agenda";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardEleve />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/historico" 
                element={
                    <ProtectedRoute>
                        <Historico />
                    </ProtectedRoute>
                } 
            />
            <Route
                path="/agenda" 
                element={
                    <ProtectedRoute>
                        <Agenda />
                    </ProtectedRoute>
                } 
            />
            <Route path="/error" element={<ErrorPage />} />
        </Routes>
    );
}