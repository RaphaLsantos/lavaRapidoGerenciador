import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { Agendamento } from "../types/SaaS";

export function useAgendamentos() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

    const buscarTodos = useCallback(async () => {
        try {
            const response = await api.get("/agendamentos");
            setAgendamentos(response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            return [];
        }
    }, []);

    const buscarPorData = useCallback(async (data: string) => {
        try {
            const response = await api.get("/agendamentos");
            const filtrados = response.data.filter((a: Agendamento) => {
                const dataAgendamento = new Date(a.dataHora).toDateString();
                const dataFiltro = new Date(data).toDateString();
                return dataAgendamento === dataFiltro;
            });
            return filtrados;
        } catch (error) {
            console.error("Erro ao buscar agendamentos por data:", error);
            return [];
        }
    }, []);

    const adicionarAgendamento = useCallback(async (agendamento: Omit<Agendamento, "id">) => {
        try {
            const response = await api.post("/agendamentos", agendamento);
            setAgendamentos([...agendamentos, response.data]);
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar agendamento:", error);
        }
    }, [agendamentos]);

    const atualizarStatus = useCallback(async (id: string | number, novoStatus: Agendamento["status"]) => {
        try {
            const response = await api.patch(`/agendamentos/${id}`, { status: novoStatus });
            setAgendamentos(agendamentos.map(a => a.id === id ? response.data : a));
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar status do agendamento:", error);
        }
    }, [agendamentos]);

    const deletarAgendamento = useCallback(async (id: string | number) => {
        try {
            await api.delete(`/agendamentos/${id}`);
            setAgendamentos(agendamentos.filter(a => a.id !== id));
        } catch (error) {
            console.error("Erro ao deletar agendamento:", error);
        }
    }, [agendamentos]);

    return {
        agendamentos,
        buscarTodos,
        buscarPorData,
        adicionarAgendamento,
        atualizarStatus,
        deletarAgendamento
    };
}
