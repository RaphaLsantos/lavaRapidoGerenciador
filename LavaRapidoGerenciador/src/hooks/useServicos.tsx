import { useState, useCallback } from "react";
import type { Servico, StatusServico } from "../types/Servico";
import { getStorageData, saveStorageData, getNextId } from "../services/localStorage";

export function useServicos() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(false);

    const buscarTodosServicos = useCallback(() => {
        setLoading(true);
        try {
            const data = getStorageData();
            setServicos(data.servicos);
            return data.servicos;
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarPorVeiculo = useCallback((veiculoId: string | number) => {
        setLoading(true);
        try {
            const data = getStorageData();
            const servicosVeiculo = data.servicos.filter(s => s.veiculoId === veiculoId || String(s.veiculoId) === String(veiculoId));
            setServicos(servicosVeiculo);
            return servicosVeiculo;
        } catch (error) {
            console.error("Erro ao buscar serviços por veículo:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const adicionarServico = (servico: Omit<Servico, "id">) => {
        try {
            const data = getStorageData();
            const novoServico: Servico = {
                ...servico,
                id: getNextId(data.servicos),
                status: "Em andamento" as StatusServico,
                dataCriacao: new Date().toISOString()
            };
            data.servicos.push(novoServico);
            setServicos((prev) => [...prev, novoServico]);
            saveStorageData(data);
            return novoServico;
        } catch (error) {
            console.error("Erro ao adicionar serviço:", error);
            throw error;
        }
    };

    const atualizarStatus = (id: string | number, status: StatusServico) => {
        try {
            const data = getStorageData();
            const index = data.servicos.findIndex(s => s.id === id || String(s.id) === String(id));
            if (index !== -1) {
                data.servicos[index].status = status;
                setServicos((prev) => 
                    prev.map((s) => (s.id === id || String(s.id) === String(id) ? data.servicos[index] : s))
                );
                saveStorageData(data);
                return data.servicos[index];
            }
            throw new Error("Serviço não encontrado");
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
