import { useState, useCallback } from "react";
import { getStorageData } from "../services/localStorage";
import type { 
    PrecoServico, 
    Funcionario, 
    Agendamento, 
    Despesa, 
    Comissao 
} from "../types/SaaS";

export function useSaaS() {
    const [loading] = useState(false);

    // --- TABELA DE PREÇOS ---
    const buscarPrecos = useCallback(() => {
        const data = getStorageData();
        return data.precosServicos;
    }, []);

    // --- FUNCIONÁRIOS E COMISSÕES ---
    const buscarFuncionarios = useCallback(() => {
        return [];
    }, []);

    const registrarComissao = (comissao: Omit<Comissao, "id">) => {
        // Placeholder para comissões
    };

    // --- AGENDAMENTOS ---
    const buscarAgendamentos = useCallback(() => {
        const data = getStorageData();
        return data.agendamentos;
    }, []);

    const criarAgendamento = (agendamento: Omit<Agendamento, "id">) => {
        // Placeholder para agendamentos
        return {} as Agendamento;
    };

    // --- DESPESAS ---
    const buscarDespesas = useCallback(() => {
        const data = getStorageData();
        return data.despesas;
    }, []);

    const adicionarDespesa = (despesa: Omit<Despesa, "id">) => {
        // Placeholder para despesas
        return {} as Despesa;
    };

    // --- HISTÓRICO DO CLIENTE ---
    const buscarHistoricoCliente = useCallback((clienteId: string | number) => {
        const data = getStorageData();
        const veiculos = data.veiculos.filter(v => v.clienteId === clienteId || String(v.clienteId) === String(clienteId));
        const idsVeiculos = veiculos.map((v: any) => v.id);
        const historico = data.servicos.filter((s: any) => idsVeiculos.includes(s.veiculoId));
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
