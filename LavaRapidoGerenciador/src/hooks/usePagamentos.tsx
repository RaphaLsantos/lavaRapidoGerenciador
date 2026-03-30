import { useState, useCallback } from "react";
import { getStorageData, saveStorageData, getNextId } from "../services/localStorage";
import type { Pagamento } from "../types/Pagamentos";

export function usePagamentos() {
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [loading, setLoading] = useState(false);

    const buscarPagamentosPorServico = useCallback((servicoId: string | number) => {
        setLoading(true);
        try {
            const data = getStorageData();
            const pagamentosFiltrados = data.pagamentos.filter(p => p.servicoId === servicoId || String(p.servicoId) === String(servicoId));
            setPagamentos(pagamentosFiltrados);
            return pagamentosFiltrados;
        } catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarTodosPagamentos = useCallback(() => {
        setLoading(true);
        try {
            const data = getStorageData();
            setPagamentos(data.pagamentos);
            return data.pagamentos;
        } catch (error) {
            console.error("Erro ao buscar todos os pagamentos:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const adicionarPagamento = (pagamento: Omit<Pagamento, "id">) => {
        try {
            const data = getStorageData();
            const novoPagamento: Pagamento = {
                ...pagamento,
                id: getNextId(data.pagamentos)
            };
            data.pagamentos.push(novoPagamento);
            setPagamentos((prev) => [...prev, novoPagamento]);
            saveStorageData(data);
            return novoPagamento;
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
