import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Veiculo} from "../types/Veiculo";

export function useVeiculos(){
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

    async function buscarPorCliente(clienteId: number){
        const response = await api.get<Veiculo[]>(
            `/veiculos?clienteId=${clienteId}`)
            ;
        setVeiculos(response.data);
    }

    async function adicionarVeiculo(veiculo: Veiculo){
        const response = await api.post("/veiculos", veiculo);
        setVeiculos(prev => [...prev, response.data]);
    }

    return{
        veiculos,
        buscarPorCliente,
        adicionarVeiculo
    };
}