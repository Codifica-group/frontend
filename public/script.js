const email_acesso = document.querySelector('#email-acesso');
const senha_acesso = document.querySelector('#senha-acesso');
const lembrar_acesso = document.querySelector('#lembrar-acesso');

const nome_cadastro = document.querySelector('#nome-cadastro');
const email_cadastro = document.querySelector('#email-cadastro');
const senha_cadastro = document.querySelector('#senha-cadastro');

window.addEventListener('load', function() {
    const loginLembrado = JSON.parse(localStorage.getItem('login_lembrado')) || [];
    completarCampos(loginLembrado.email, loginLembrado.senha, loginLembrado.lembrar);
});

const completarCampos = (email, senha, loginLembrado) => {
    email_acesso.value = email || null;
    senha_acesso.value = senha || null;
    lembrar_acesso.checked = loginLembrado || false;    
}

login.addEventListener('submit', (event) => {
    event.preventDefault();
    realizarLogin();
});

lembrar_acesso.addEventListener("change", () => {
    if (!lembrar_acesso.checked) {
        localStorage.removeItem('login_lembrado')
    }
});

const realizarLogin = async () => {
    const email = email_acesso.value;
    const senha = senha_acesso.value;
    const lembrarAcesso = lembrar_acesso.checked;

    const url = `http://localhost:3000/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`;

    try {
        const response = await fetch(url);  
        const dados = await response.json();

        if (dados.length === 0) {
            alert('Nenhum dado retornado!');
        } else {
            alert('Login bem-sucedido: ' + JSON.stringify(dados));
            if (lembrarAcesso) {
                const novoLogin = {
                    email: email_acesso.value,
                    senha: senha_acesso.value,
                    lembrar: lembrarAcesso,
                };
                localStorage.setItem('login_lembrado', JSON.stringify(novoLogin));
            }
            window.location.href = './dashboard.html';
        }
    } catch (error) {
        console.error('Erro no login: ', error);
        alert('Erro ao realizar login.');
    }
};