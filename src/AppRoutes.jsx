import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardEleve from "./pages/Dashboard";
import Historico from "./pages/Historico";
import Agenda from "./pages/Agenda";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Comparacao from "./pages/Comparacao";
import Gerenciar from "./pages/Gerenciar";

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
            <Route
                path="/comparacao"
                element={
                    <ProtectedRoute>
                        <Comparacao />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gerenciar"
                element={
                    <ProtectedRoute>
                        <Gerenciar />
                    </ProtectedRoute>
                }
            />
            <Route path="/error" element={<ErrorPage />} />
        </Routes>
    );
}