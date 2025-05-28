import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { postVerificacao } from "../utils/post";

export default function ProtectedRoute({ children }) {
    const [responseToken, setResponseToken] = useState(undefined);
    const storedToken = localStorage.getItem("token");

    useEffect(() => {
        (async () => {
            const result = await postVerificacao(storedToken);
            setResponseToken(result);
        })();
    }, [storedToken]);

    // Enquanto está carregando
    if (responseToken === undefined) {
        return <div>Verificando autenticação...</div>;
    }

    // Se o token for inválido ou não autorizado
    if (responseToken?.status != 200) {
        return <Navigate to="/error" replace />;
    }

    // Se o token for válido
    return children;
}