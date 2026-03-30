import { useState } from "react";
import type { Veiculo } from "../types/Veiculo";
import { getStorageData, saveStorageData, getNextId } from "../services/localStorage";

export function useVeiculos() {
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

    function buscarPorCliente(clienteId: number) {
        const data = getStorageData();
        const veiculosCliente = data.veiculos.filter(v => v.clienteId === clienteId);
        setVeiculos(veiculosCliente);
    }

    function adicionarVeiculo(veiculo: Veiculo) {
        const data = getStorageData();
        const novoVeiculo: Veiculo = {
            ...veiculo,
            id: getNextId(data.veiculos)
        };
        data.veiculos.push(novoVeiculo);
        setVeiculos(prev => [...prev, novoVeiculo]);
        saveStorageData(data);
    }

    function deletarVeiculo(id: number) {
        const data = getStorageData();
        data.veiculos = data.veiculos.filter(v => v.id !== id);
        data.servicos = data.servicos.filter(s => s.veiculoId !== id);
        setVeiculos(prev => prev.filter(v => v.id !== id));
        saveStorageData(data);
    }

    return {
        veiculos,
        buscarPorCliente,
        adicionarVeiculo,
        deletarVeiculo
    };
}