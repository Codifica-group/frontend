// Mapeamento dos status do back-end para status do front-end
export const STATUS_MAPPING = {
    // Status do back-end → Status do front-end
    'PENDENTE': 'Aguardando orçamento',
    'AGUARDANDO_ORCAMENTO': 'Aguardando orçamento',
    'ACEITO_PELO_USUARIO': 'Aguardando Aprovação',
    'AGUARDANDO_APROVACAO': 'Aguardando Aprovação',
    'RECUSADO_PELO_USUARIO': 'Recusado',
    'RECUSADO_PELO_CLIENTE': 'Recusado',
    'RECUSADO': 'Recusado',
    'APROVADO': 'Aprovado',
    'FINALIZADO': 'Aprovado'
};

// Mapeamento reverso para enviar ao back-end
export const REVERSE_STATUS_MAPPING = {
    'Aguardando orçamento': 'AGUARDANDO_ORCAMENTO',
    'Aguardando Aprovação': 'ACEITO_PELO_USUARIO',
    'Recusado': 'RECUSADO_PELO_USUARIO',
    'Aprovado': 'APROVADO'
};

// Cores dos cards conforme status
export const STATUS_COLORS = {
    'Aguardando orçamento': 'status-aguardando-orcamento', // cinza
    'Aguardando Aprovação': 'status-aguardando-aprovacao', // amarelo
    'Aprovado': 'status-aprovado', // verde
    'Recusado': 'status-recusado' // vermelho
};

// Função para mapear status do back-end para front-end
export const mapStatusFromBackend = (backendStatus) => {
    return STATUS_MAPPING[backendStatus] || backendStatus;
};

// Função para mapear status do front-end para back-end
export const mapStatusToBackend = (frontendStatus) => {
    return REVERSE_STATUS_MAPPING[frontendStatus] || frontendStatus;
};

// Função para obter a classe CSS do status
export const getStatusClass = (status) => {
    return STATUS_COLORS[status] || 'status-pendente';
};

// Função para verificar se um status permite ações (recusar/enviar oferta)
export const canPerformActions = (status) => {
    return status === 'Aguardando orçamento' || status === 'Aguardando Aprovação';
};

// Função para formatar a data/hora da solicitação
export const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}h`;
};

// Função para formatar lista de serviços
export const formatServices = (servicos) => {
    if (!servicos || !Array.isArray(servicos)) return '';
    return servicos.map(servico => servico.nome || servico).join(', ');
};

// Função para transformar dados do back-end para formato do front-end
export const transformSolicitacaoData = (backendData) => {
    // Debug: log do status original para verificar os dados
    console.log('🔄 Transformando dados do back-end:', {
        id: backendData.id,
        statusOriginal: backendData.status,
        statusMapeado: mapStatusFromBackend(backendData.status)
    });
    
    const transformedData = {
        id: backendData.id,
        status: mapStatusFromBackend(backendData.status),
        dataHora: formatDateTime(backendData.dataHoraSolicitacao),
        servicos: formatServices(backendData.servicos),
        pet: backendData.pet?.nome || '',
        raca: backendData.pet?.raca?.nome || '',
        cliente: backendData.cliente?.nome || '',
        celular: backendData.cliente?.telefone || '',
        etapa: mapStatusFromBackend(backendData.status),
        // Dados originais para o modal
        originalData: backendData
    };
    
    return transformedData;
};