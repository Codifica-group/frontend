export const STATUS_MAPPING = {
    'AGUARDANDO_RESPOSTA_PETSHOP': 'Aguardando orçamento',
    'ACEITO_PELO_PETSHOP': 'Aguardando Aprovação',
    'RECUSADO_PELO_USUARIO': 'Recusado pelo Cliente',
    'RECUSADO_PELO_CLIENTE': 'Recusado pelo Cliente',
    'RECUSADO_PELO_PETSHOP': 'Recusado',
    'CONFIRMADO': 'Aprovado',
    'FINALIZADO': 'Aprovado'
};

export const REVERSE_STATUS_MAPPING = {
    'Aguardando orçamento': 'AGUARDANDO_RESPOSTA_PETSHOP',
    'Aguardando Aprovação': 'ACEITO_PELO_PETSHOP',
    'Recusado': 'RECUSADO_PELO_PETSHOP',
    'Recusado pelo Cliente': 'RECUSADO_PELO_CLIENTE',
    'Aprovado': 'CONFIRMADO'
};

export const STATUS_COLORS = {
    'Aguardando orçamento': 'status-aguardando-orcamento',
    'Aguardando Aprovação': 'status-aguardando-aprovacao',
    'Aprovado': 'status-aprovado',
    'Recusado': 'status-recusado',
    'Recusado pelo Cliente': 'status-recusado'
};

export const mapStatusFromBackend = (backendStatus) => {
    return STATUS_MAPPING[backendStatus] || backendStatus;
};

export const mapStatusToBackend = (frontendStatus) => {
    return REVERSE_STATUS_MAPPING[frontendStatus] || frontendStatus;
};

export const getStatusClass = (status) => {
    return STATUS_COLORS[status] || 'status-pendente';
};

export const canPerformActions = (status) => {
    return status === 'Aguardando orçamento' || status === 'Aguardando Aprovação';
};

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

export const formatServices = (servicos) => {
    if (!servicos || !Array.isArray(servicos)) return '';
    return servicos.map(servico => servico.nome || servico).join(', ');
};

export const transformSolicitacaoData = (backendData) => {
    const transformedData = {
        id: backendData.id,
        status: mapStatusFromBackend(backendData.status),
        dataHora: formatDateTime(backendData.dataHoraInicio),
        servicos: formatServices(backendData.servicos),
        pet: backendData.pet?.nome || '',
        raca: backendData.pet?.raca?.nome || '',
        dataSolicitacao: formatDateTime(backendData.dataHoraSolicitacao),
        cliente: backendData.cliente?.nome || '',
        celular: backendData.cliente?.telefone || '',
        etapa: mapStatusFromBackend(backendData.status),
        originalData: backendData
    };
    
    return transformedData;
};