import api from "./api";

export async function postDespesa(body){
    try {
        const response = await api.post("/despesas", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro ao criar Despesa:", error.response || error.message);
        throw error;
    };
}

export async function postProduto(body){
    try {
        const response = await api.post("/produtos", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro ao criar Produto:", error.response || error.message);
        throw error;
    };
}

export async function postLucro(body){
    try {
        const response = await api.post("/agendas/calcular/lucro", body)
        return response.data;
    }
    catch(error) {
        console.error("Erro ao criar Lucro:", error.response || error.message);
        throw error;
    };
}

export const postAgenda = async (agenda) => {
  try {
    const response = await api.post("/agendas", agenda);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar Agenda:", error.response || error.message);
    throw error;
  }
};

export async function postCliente(body) {
    try {
        const response = await api.post("/clientes", body);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar Cliente:", error.response || error.message);
        throw error;
    }
}

export async function postPet(body) {
    try {
        const response = await api.post("/pets", body);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar Pet:", error.response || error.message);
        throw error;
    }
}

export async function postRaca(body) {
    try {
        const response = await api.post("/racas", body, {
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

export async function logoutUser() {
    try {
        const response = await api.post("/usuarios/logout");
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer logout:", error.response || error.message);
        throw error;
    }
}
