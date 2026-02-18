export interface PrecoServico {
    id: string | number;
    nome: string;
    preco: number;
    categoria: "Lavagem" | "Estética" | "Mecânica";
}

export interface Funcionario {
    id: string | number;
    nome: string;
    cargo: string;
    comissaoPercentual: number; // Ex: 10 para 10%
}

export interface Agendamento {
    id: string | number;
    clienteId: string | number;
    veiculoId: string | number;
    servicoTipoId: string | number;
    dataHora: string;
    status: "Pendente" | "Confirmado" | "Cancelado" | "Concluído";
}

export interface Despesa {
    id: string | number;
    descricao: string;
    valor: number;
    categoria: "Aluguel" | "Produtos" | "Salários" | "Outros";
    data: string;
}

export interface Comissao {
    id: string | number;
    funcionarioId: string | number;
    servicoId: string | number;
    valor: number;
    data: string;
}
