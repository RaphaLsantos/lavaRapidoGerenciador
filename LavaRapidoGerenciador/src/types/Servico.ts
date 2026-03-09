export type StatusServico = "Agendado" | "Em andamento" | "Finalizado" | "Cancelado";

export interface Servico {
    id?: string | number;
    descricao: string;
    valor: number;
    veiculoId: string | number;
    status: StatusServico;
    dataCriacao: string; // ISO string
    dataFinalizacao?: string; // ISO string
    funcionarioId?: string | number;
    notas?: string;
}
