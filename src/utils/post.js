import axios from "axios";

export async function postDespesa(body){
    try {
        const response = await axios.post("http://localhost:8080/api/despesas", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro ao criar Despesa:", error.response || error.message);
        throw error;
    };
}

export async function postProduto(body){
    try {
        const response = await axios.post("http://localhost:8080/api/produtos", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro ao criar Produto:", error.response || error.message);
        throw error;
    };
}

export async function postLucro(body){
    try {
        const response = await axios.post("http://localhost:8080/api/agendas/calcular/lucro", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro ao criar Lucro:", error.response || error.message);
        throw error;
    };
}

export async function postVerificacao(token){
    try {
        const response = await axios.post(
            "http://localhost:8080/api/auth/validate",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    }
    catch(error) {
        console.error("Erro ao verificar token:", error.response || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Erro desconhecido",
            status: error.response?.status || 500,
        };
    };
}

export const postAgenda = async (agenda) => {
  try {
    const response = await axios.post("http://localhost:8080/api/agendas", agenda);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar Agenda:", error.response || error.message);
    throw error;
  }
};

export async function postCliente(body) {
    try {
        const response = await axios.post("http://localhost:8080/api/clientes", body);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar Cliente:", error.response || error.message);
        throw error;
    }
}

export async function postPet(body) {
    try {
        const response = await axios.post("http://localhost:8080/api/pets", body);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar Pet:", error.response || error.message);
        throw error;
    }
}

export async function postRaca(body) {
    try {
        const response = await axios.post("http://localhost:8080/api/racas", body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar Raça:", error.response || error.message);
        throw error;
    }
}