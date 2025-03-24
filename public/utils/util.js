var Util = {
    get: async function (url) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Erro na requisição: ${res.status}`);
            }
            const json = await res.json();
            console.log('Dados recebidos: ', json);
            
            return json;
        } catch (error) {
            console.error('Erro no login: ', error);
            throw error;
        }
    },

    modal: function (text) {
        const modalContent = document.querySelector('#modalContent');
        const modal = document.querySelector('#modal');

        modalContent.style.display = 'block';
        
        modal.innerHTML = `<p>${text}</p>`;

        setTimeout(() => {
            modalContent.style.display = 'none';
        }, 3000);
    }
};