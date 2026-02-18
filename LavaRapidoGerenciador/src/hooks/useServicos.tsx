import { useState } from "react";
import axios from "axios";
import type { Servico } from "../types/Servico";

const API_URL = "http://localhost:3000/servicos";

export function useServicos() {
    const [servicos, setServicos] = useState<Servico[]>([]);

    async function buscarPorVeiculo(veiculoId: number) {
        const response = await axios.get(`${API_URL}?veiculoId=${veiculoId}`);
        setServicos(response.data);
    }

    async function adicionarServico(servico: Servico) {
        await axios.post(API_URL, servico);
        buscarPorVeiculo(servico.veiculoId);
    }

    async function marcarComoPago(id: number, servico: Servico) {
        await axios.put(`${API_URL}/${id}`, {
            ...servico,
            pago: true
        });

        buscarPorVeiculo(servico.veiculoId);
    }


    return {
        servicos,
        buscarPorVeiculo,
        adicionarServico,
        marcarComoPago
    };
}      