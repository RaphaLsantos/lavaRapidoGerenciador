import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { 
    PrecoServico, 
    Funcionario, 
    Agendamento, 
    Despesa, 
    Comissao 
} from "../types/SaaS";

export function useSaaS() {
    const [loading, setLoading] = useState(false);

    // --- TABELA DE PREÇOS ---
    const buscarPrecos = useCallback(async () => {
        const response = await api.get<PrecoServico[]>("/precosServicos");
        return response.data;
    }, []);

    // --- FUNCIONÁRIOS E COMISSÕES ---
    const buscarFuncionarios = useCallback(async () => {
        const response = await api.get<Funcionario[]>("/funcionarios");
        return response.data;
    }, []);

    const registrarComissao = async (comissao: Omit<Comissao, "id">) => {
        await api.post("/comissoes", comissao);
    };

    // --- AGENDAMENTOS ---
    const buscarAgendamentos = useCallback(async () => {
        const response = await api.get<Agendamento[]>("/agendamentos");
        return response.data;
    }, []);

    const criarAgendamento = async (agendamento: Omit<Agendamento, "id">) => {
        const response = await api.post<Agendamento>("/agendamentos", agendamento);
        return response.data;
    };

    // --- DESPESAS ---
    const buscarDespesas = useCallback(async () => {
        const response = await api.get<Despesa[]>("/despesas");
        return response.data;
    }, []);

    const adicionarDespesa = async (despesa: Omit<Despesa, "id">) => {
        const response = await api.post<Despesa>("/despesas", despesa);
        return response.data;
    };

    // --- HISTÓRICO DO CLIENTE ---
    const buscarHistoricoCliente = useCallback(async (clienteId: string | number) => {
        // Busca serviços vinculados aos veículos do cliente
        const veiculos = await api.get(`/veiculos?clienteId=${clienteId}`);
        const idsVeiculos = veiculos.data.map((v: any) => v.id);
        
        const servicos = await api.get("/servicos");
        const historico = servicos.data.filter((s: any) => idsVeiculos.includes(s.veiculoId));
        
        return historico;
    }, []);

    return {
        loading,
        buscarPrecos,
        buscarFuncionarios,
        registrarComissao,
        buscarAgendamentos,
        criarAgendamento,
        buscarDespesas,
        adicionarDespesa,
        buscarHistoricoCliente
    };
}
