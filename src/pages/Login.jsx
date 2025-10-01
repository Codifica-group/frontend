import "../styles/style-login.css";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalLoading from "../components/ModalLoading";

export default function LoginPage() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [messageModal, setMessageModal] = useState("");
    const [titleModal, setTitleModal] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrar, setLembrar] = useState(false);

    useEffect(() => {
        const emailStorage = localStorage.getItem("email");
        const lembrarStorage = localStorage.getItem("lembrar") === "true";

        if (lembrarStorage) {
            setEmail(emailStorage);
            setLembrar(lembrarStorage);
        }
    }, []);

    useEffect(() => {
        if (lembrar) {
            localStorage.setItem("email", email);
        }
    }, [email, lembrar]);

    useEffect(() => {
        if (!lembrar){
            localStorage.removeItem("email");
            localStorage.removeItem("lembrar");
        }
        else {
            localStorage.setItem("lembrar", lembrar);
        }
        
    }, [lembrar]);

    function logar() {
        setLoading(true);
        const usuario = {
            email: email,
            senha: senha
        };

        const usuarioString = JSON.stringify(usuario);

        fetch("http://localhost:8080/api/usuarios/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: usuarioString
        })
        .then(async (response) => {
            setLoading(false);
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem("token", data.token);
                setMessageModal(data.mensagem);
                setTitleModal(true)

            } else {
                const errorData = await response.json();
                sessionStorage.removeItem("token");
                setMessageModal(errorData.message);
                setTitleModal(false)
            }
            setShowModal(true);
        })
        .catch((error) => {
            setLoading(false);
            console.error("Erro:", error);
            sessionStorage.removeItem("token");
            setMessageModal("Erro ao fazer login. Tente novamente mais tarde." + error.message);
            setTitleModal(false)
            setShowModal(true);
        });
    }

    function redirecionar(sucesso) {
        setShowModal(false)
        if (sucesso) {
            navigate("/Agenda");
        }
    }

    return (
        <div className="conteiner">
            {loading && <ModalLoading />}
            <div className="secao-login">
                <div className="conteiner-logo">
                    <img src={logo} alt="Eleve Pet Shop" className="logo" />
                </div>
                <h2>Acesse e aproveite!</h2>
                <form id="login" onSubmit={(e) => { e.preventDefault(); logar(); }}>
                    <div className="grupo-formulario">
                        <label>Email</label>
                        <input type="email" id="email-acesso" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grupo-formulario">
                        <label>Senha</label>
                        <input type="password" id="senha-acesso" value={senha} placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
                    </div>

                    <div className="lembrar-me">
                        <input
                            type="checkbox"
                            id="lembrar-acesso"
                            checked={lembrar}
                            onChange={() => setLembrar(!lembrar)}
                        />
                        <label>Lembrar de mim</label>
                    </div>

                    <button type="submit" className="botao-primario">Entrar</button>
                </form>
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-login">
                            <h2 className={titleModal ? "sucesso" : "fracasso"}>{titleModal == null ? "Carregando" : titleModal ? "Login bem-sucedido" : "Erro ao fazer login"}</h2>
                            <p>{messageModal}</p>
                            <button onClick={() =>redirecionar(titleModal)}>OK</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
