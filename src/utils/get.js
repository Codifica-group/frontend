import api from "./api";

export async function getProdutos() {
    try {
        const response = await api.get(`/produtos`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Produtos:", error.response || error.message);
        throw error;
    }
}

export async function getCategorias() {
    try {
        const response = await api.get(`/categorias`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Categorias:", error.response || error.message);
        throw error;
    }
}

export async function getDespesas(offset = 0, size = 100) {
    try {
        const response = await api.get(`/despesas?offset=${offset}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Despesas:", error.response || error.message);
        throw error;
    }
}

export async function getServicos() {
    try {
        const response = await api.get(`/servicos`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Servicos:", error.response || error.message);
        throw error;
    }
}

export async function getHistorico(filtro, offset = 0, size = 100) {
    try {
        const response = await api.post(`/agendas/filtrar?offset=${offset}&size=${size}`, filtro);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Historico:", error.response || error.message);
        throw error;
    }
}

export async function getPets(offset = 0, size = 100) {
    try {
        const response = await api.get(`/pets?offset=${offset}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Pets:", error.response || error.message);
        throw error;
    }
}

export async function getClientes(offset = 0, size = 100) {
    try {
        const response = await api.get(`/clientes?offset=${offset}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Clientes:", error.response || error.message);
        throw error;
    }
}

export async function getRacas() {
    try {
        const response = await api.get(`/racas`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Racas:", error.response || error.message);
        throw error;
    }
}

export const getAgendas = async (offset = 0, size = 100) => {
    try {
        const response = await api.get(`/agendas?offset=${offset}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Agendas:", error.response || error.message);
        throw error;
    }
};

export async function getEndereco(cep) {
    try {
        const response = await api.get(`/cep/${cep}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Endereco:", error.response || error.message);
        throw error;
    }
}

export async function getSolicitacoes(offset = 0, size = 100) {
    try {
        const response = await api.get(`/solicitacoes-agenda?offset=${offset}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Solicitações:", error.response || error.message);
        throw error;
    }
}

export async function getSolicitacaoById(id) {
    try {
        const response = await api.get(`/solicitacoes-agenda/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar Solicitação:", error.response || error.message);
        throw error;
    }
}
