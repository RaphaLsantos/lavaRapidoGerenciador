import { useState, useCallback } from "react";
import { getStorageData } from "../services/localStorage";
import type { Despesa } from "../types/SaaS";

export function useDespesas() {
    const [despesas, setDespesas] = useState<Despesa[]>([]);

    const buscarTodas = useCallback(() => {
        const data = getStorageData();
        setDespesas(data.despesas);
        return data.despesas;
    }, []);

    const buscarPorMes = useCallback((mes: number, ano: number) => {
        const data = getStorageData();
        const filtradas = data.despesas.filter((d: Despesa) => {
            const dataObj = new Date(d.data);
            return dataObj.getMonth() === mes && dataObj.getFullYear() === ano;
        });
        return filtradas;
    }, []);

    const adicionarDespesa = useCallback((despesa: Omit<Despesa, "id">) => {
        const data = getStorageData();
        const newDespesa = { ...despesa, id: Date.now() } as Despesa;
        data.despesas.push(newDespesa);
        localStorage.setItem('lava-rapido-data', JSON.stringify(data));
        setDespesas(data.despesas);
        return newDespesa;
    }, []);

    const deletarDespesa = useCallback((id: string | number) => {
        const data = getStorageData();
        data.despesas = data.despesas.filter(d => d.id !== id);
        localStorage.setItem('lava-rapido-data', JSON.stringify(data));
        setDespesas(data.despesas);
    }, []);

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
