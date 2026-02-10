import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Cliente } from "../types/Cliente";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState<string>("");

  useEffect(() => {
    buscarClientes();
  }, []);

  async function buscarClientes() {
    const response = await api.get<Cliente[]>("/clientes");
    setClientes(response.data);
  }

  async function adicionarCliente() {
    if (!nome) return;

    const novoCliente: Cliente = { nome };

    await api.post("/clientes", novoCliente);
    setNome("");
    buscarClientes();
  }

  return (
    <div>
      <h1>Clientes</h1>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <button onClick={adicionarCliente}>Adicionar</button>

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.nome}</li>
        ))}
      </ul>
    </div>
  );
}