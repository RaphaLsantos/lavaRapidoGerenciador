import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Cliente } from "../types/Cliente";

export function useClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

    useEffect(() => {
        buscarClientes();
    }, []);

    async function buscarClientes() {
        const response = await api.get<Cliente[]>("/clientes");
        setClientes(response.data);
    }

    async function salvarCliente(nome: string) {
        if (!nome) return;

        if (clienteEditando) {
            await api.put(`/clientes/${clienteEditando.id}`, {
                ...clienteEditando,
                nome
            });

            setClientes(clientes.map(c =>
                c.id === clienteEditando.id
                    ? { ...c, nome }
                    : c
            ));

            setClienteEditando(null);

        } else {
            // MODO CRIAÇÃO
            const response = await api.post("/clientes", { nome });
            setClientes([...clientes, response.data]);
        }
    }

    async function deletarCliente(id: number) {
      await api.delete(`/clientes/${id}`);
      setClientes(clientes.filter(c => c.id !== id));
    }

    function iniciarEdicao(cliente: Cliente){
        setClienteEditando(cliente);
    }

    return{
        clientes,
        clienteEditando,
        salvarCliente,
        deletarCliente,
        iniciarEdicao
    };

    
}