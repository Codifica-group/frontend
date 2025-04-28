import "../styles/style-login.css";
import logo from "../assets/logo.png";
import { useState } from "react";

export default function LoginPage() {

    const [showModal, setShowModal] = useState(false);
    const [messageModal, setMessageModal] = useState("");
    const [titleModal, setTitleModal] = useState(false);

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

        setShowModal(true);
        fetch("http://localhost:8080/api/usuarios/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: usuarioString
        })
        .then(async (response) => {
            if (response.ok) {
                setMessageModal(await response.text() + " Direcionando para o dashboard...");
                setTitleModal(true)

            } else {
                const errorData = await response.json();
                console.error("Erro:", errorData);
                setMessageModal(errorData.message + " Insita as credenciais corretamente.");
                setTitleModal(false)
            }
        })
        .catch((error) => {
            console.error("Erro:", error);
            setMessageModal("Erro ao fazer login. Tente novamente mais tarde." + error.message);
            setTitleModal(false)
        });
    }

    function redirecionar(sucesso) {
        setShowModal(false)
        if (sucesso) {
            window.location.href = "/dashboard";
        }
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
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-login">
                            <h2 className={titleModal ? "sucesso" : "fracasso"}>{titleModal ? "Login bem-sucedido" : "Erro ao fazer login"}</h2>
                            <p>{messageModal}</p>
                            <button onClick={() =>redirecionar(titleModal)}>OK</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 