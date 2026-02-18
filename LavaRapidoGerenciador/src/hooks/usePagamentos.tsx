import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { Pagamento } from "../types/Pagamentos";

export function usePagamentos() {
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [loading, setLoading] = useState(false);

    const buscarPagamentosPorServico = useCallback(async (servicoId: string | number) => {
        setLoading(true);
        try {
            const response = await api.get<Pagamento[]>(`/pagamentos?servicoId=${servicoId}`);
            setPagamentos(response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarTodosPagamentos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<Pagamento[]>("/pagamentos");
            setPagamentos(response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar todos os pagamentos:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const adicionarPagamento = async (pagamento: Omit<Pagamento, "id">) => {
        try {
            const response = await api.post<Pagamento>("/pagamentos", pagamento);
            setPagamentos((prev) => [...prev, response.data]);
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar pagamento:", error);
            throw error;
        }
    };

    return {
        pagamentos,
        loading,
        buscarPagamentosPorServico,
        buscarTodosPagamentos,
        adicionarPagamento
    };
}
