import React from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/style-error.css";

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="error-container">
            <h1>Acesso Negado</h1>
            <p>Você não tem permissão para acessar esta página. Por favor, faça login.</p>
            <button onClick={() => navigate("/")}>Ir para Login</button>
        </div>
    );
}