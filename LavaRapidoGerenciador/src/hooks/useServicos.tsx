import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { Servico, StatusServico } from "../types/Servico";

export function useServicos() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(false);

    const buscarTodosServicos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<Servico[]>("/servicos");
            setServicos(response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarPorVeiculo = useCallback(async (veiculoId: string | number) => {
        setLoading(true);
        try {
            const response = await api.get<Servico[]>(`/servicos?veiculoId=${veiculoId}`);
            setServicos(response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar serviços por veículo:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const adicionarServico = async (servico: Omit<Servico, "id">) => {
        try {
            const novoServico = {
                ...servico,
                status: "Em andamento" as StatusServico,
                dataCriacao: new Date().toISOString()
            };
            const response = await api.post<Servico>("/servicos", novoServico);
            setServicos((prev) => [...prev, response.data]);
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar serviço:", error);
            throw error;
        }
    };

    const atualizarStatus = async (id: string | number, status: StatusServico) => {
        try {
            const response = await api.patch<Servico>(`/servicos/${id}`, { status });
            setServicos((prev) => 
                prev.map((s) => (s.id === id ? response.data : s))
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar status do serviço:", error);
            throw error;
        }
    };

    return {
        servicos,
        loading,
        buscarTodosServicos,
        buscarPorVeiculo,
        adicionarServico,
        atualizarStatus
    };
}
