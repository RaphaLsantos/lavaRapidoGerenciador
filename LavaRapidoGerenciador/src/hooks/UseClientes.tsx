import { useEffect, useState } from "react";
import type { Cliente } from "../types/Cliente";
import { getStorageData, saveStorageData, getNextId } from "../services/localStorage";

export function useClientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

    useEffect(() => {
        buscarClientes();
    }, []);

    function buscarClientes() {
        const data = getStorageData();
        setClientes(data.clientes);
    }

    function salvarCliente(nome: string) {
        if (!nome) return;

        const data = getStorageData();

        if (clienteEditando) {
            // Modo edição
            const index = data.clientes.findIndex(c => c.id === clienteEditando.id);
            if (index !== -1) {
                data.clientes[index] = { ...data.clientes[index], nome };
                setClientes([...data.clientes]);
                setClienteEditando(null);
            }
        } else {
            // Modo criação
            const novoCliente: Cliente = {
                id: getNextId(data.clientes),
                nome
            };
            data.clientes.push(novoCliente);
            setClientes([...data.clientes]);
        }

        saveStorageData(data);
    }

    function deletarCliente(id: number) {
        const data = getStorageData();
        data.clientes = data.clientes.filter(c => c.id !== id);
        data.veiculos = data.veiculos.filter(v => v.clienteId !== id);
        setClientes(data.clientes);
        saveStorageData(data);
    }

    function iniciarEdicao(cliente: Cliente) {
        setClienteEditando(cliente);
    }

    return {
        clientes,
        clienteEditando,
        salvarCliente,
        deletarCliente,
        iniciarEdicao
    };
}