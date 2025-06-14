import axios from "axios";

export async function getProdutos() {
    try {
        const response = await axios.get("http://localhost:8080/api/produtos");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Produtos:", error.response || error.message);
        throw error;
    }
}

export async function getCategorias() {
    try {
        const response = await axios.get("http://localhost:8080/api/categorias");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Categorias:", error.response || error.message);
        throw error;
    }
}

export async function getDespesas() {
    try {
        const response = await axios.get("http://localhost:8080/api/despesas");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Despesas:", error.response || error.message);
        throw error;
    }
}

export async function getServicos() {
    try {
        const response = await axios.get("http://localhost:8080/api/servicos");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Servicos:", error.response || error.message);
        throw error;
    }
}

export async function getHistorico(filtro) {
    try {
        const response = await axios.post("http://localhost:8080/api/agendas/filtrar", filtro);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Historico:", error.response || error.message);
        throw error;
    }
}

export async function getPets() {
    try {
        const response = await axios.get("http://localhost:8080/api/pets");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Pets:", error.response || error.message);
        throw error;
    }
}

export async function getClientes() {
    try {
        const response = await axios.get("http://localhost:8080/api/clientes");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Clientes:", error.response || error.message);
        throw error;
    }
}

export async function getRacas() {
    try {
        const response = await axios.get("http://localhost:8080/api/racas");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Racas:", error.response || error.message);
        throw error;
    }
}

export const getAgendas = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/agendas");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Agendas:", error.response || error.message);
        throw error;
    }
};

export async function getEndereco(cep) {
    try {
        const response = await axios.get(`http://localhost:8080/api/cep/${cep}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Endereco:", error.response || error.message);
        throw error;
    }
}