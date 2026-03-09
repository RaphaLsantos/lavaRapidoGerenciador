import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { Despesa } from "../types/SaaS";

export function useDespesas() {
    const [despesas, setDespesas] = useState<Despesa[]>([]);

    const buscarTodas = useCallback(async () => {
        try {
            const response = await api.get("/despesas");
            setDespesas(response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar despesas:", error);
            return [];
        }
    }, []);

    const buscarPorMes = useCallback(async (mes: number, ano: number) => {
        try {
            const response = await api.get("/despesas");
            const filtradas = response.data.filter((d: Despesa) => {
                const data = new Date(d.data);
                return data.getMonth() === mes && data.getFullYear() === ano;
            });
            return filtradas;
        } catch (error) {
            console.error("Erro ao buscar despesas por mês:", error);
            return [];
        }
    }, []);

    const adicionarDespesa = useCallback(async (despesa: Omit<Despesa, "id">) => {
        try {
            const response = await api.post("/despesas", despesa);
            setDespesas([...despesas, response.data]);
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar despesa:", error);
        }
    }, [despesas]);

    const deletarDespesa = useCallback(async (id: string | number) => {
        try {
            await api.delete(`/despesas/${id}`);
            setDespesas(despesas.filter(d => d.id !== id));
        } catch (error) {
            console.error("Erro ao deletar despesa:", error);
        }
    }, [despesas]);

    const calcularTotalDespesas = useCallback((despesasArray: Despesa[]) => {
        return despesasArray.reduce((acc, d) => acc + d.valor, 0);
    }, []);

    return {
        despesas,
        buscarTodas,
        buscarPorMes,
        adicionarDespesa,
        deletarDespesa,
        calcularTotalDespesas
    };
}
