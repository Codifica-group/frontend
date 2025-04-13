import "../styles/style-login.css";
import logo from "../assets/logo.png";
import { useState } from "react";

export function LoginPage() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrar, setLembrar] = useState(false);

    function logar() {
        const usuario = {
            email: email,
            senha: senha
        };

        const usuarioString = JSON.stringify(usuario);
        localStorage.setItem("usuario", usuarioString);

        fetch("http://localhost:8080/api/usuarios/login", {
            method: "POST",
            body: usuarioString
        })
        .then((response) => {
            if (response.ok) {
                window.location.href = "/dashboard";
            } else {
                console.log(response);
            }
        })
        .catch((error) => {
            console.error("Erro:", error);
            alert("Erro ao fazer login. Tente novamente mais tarde." + error.message);
        });
        
    }

    return (
        <div className="conteiner">
            <div className="secao-login">
                <div className="conteiner-logo">
                    <img src={logo} alt="Eleve Pet Shop" className="logo" />
                </div>
                <h2>Acesse e aproveite!</h2>
                <form id="login" onSubmit={(e) => { e.preventDefault(); logar(); }}>
                    <div className="grupo-formulario">
                        <label>Email</label>
                        <input type="email" id="email-acesso" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grupo-formulario">
                        <label>Senha</label>
                        <input type="password" id="senha-acesso" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
                    </div>

                    <div className="lembrar-me">
                        <input type="checkbox" id="lembrar-acesso" onChange={(e) => setLembrar(e.target.value)} />
                        <label>Lembrar de mim</label>
                    </div>

                    <button type="submit" className="botao-primario">Entrar</button>
                </form>
            </div>
        </div>
    );
} 