import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardEleve from "./pages/Dashboard";
import Historico from "./pages/Historico";
import Agenda from "./pages/Agenda";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Comparacao from "./pages/Comparacao";
import Gerenciar from "./pages/Gerenciar";
import Solicitacao from "./pages/Solicitacao";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
                path="/dashboard"
                element={
              
                        <DashboardEleve />
                  
                       
                }
            />
            <Route
                path="/historico"
                element={
                    
                        <Historico />
                    
                }
            />
             <Route
                path="/solicitacao"
                element={
                    
                        <Solicitacao />
                   
                }
            />
            <Route
                path="/agenda"
                element={
                
                        <Agenda />
                  
                }
            />
            <Route
                path="/comparacao"
                element={
            
                        <Comparacao />
                 
                }
            />
            <Route
                path="/gerenciar"
                element={
                 
                        <Gerenciar />
                  
                }
            />
            <Route path="/error" element={<ErrorPage />} />
        </Routes>
    );
}