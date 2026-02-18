export type StatusServico = "Em andamento" | "Finalizado";

export interface Servico {
    id?: string | number;
    descricao: string;
    valor: number;
    veiculoId: string | number;
    status: StatusServico;
    dataCriacao: string; // ISO string
}
