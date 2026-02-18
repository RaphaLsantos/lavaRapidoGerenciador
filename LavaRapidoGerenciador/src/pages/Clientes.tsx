import { useEffect, useState } from "react";
import type { Cliente } from "../types/Cliente";
import { useClientes } from "../hooks/UseClientes";
import { useVeiculos } from "../hooks/UseVeiculos";

export default function Clientes() {
  const [nome, setNome] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(null);
  const {
    clientes,
    clienteEditando,
    salvarCliente,
    deletarCliente,
    iniciarEdicao
  } = useClientes();

  const {
    veiculos,
    buscarPorCliente,
    adicionarVeiculo
  } = useVeiculos();

  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");



  // 👇 SINCRONIZA O INPUT QUANDO ENTRA EM MODO EDIÇÃO
  useEffect(() => {
    if (clienteEditando) {
      setNome(clienteEditando.nome);
    } else {
      setNome("");
    }
  }, [clienteEditando]);

  function selecionarCliente(id: number) {
    setClienteSelecionado(id);
    buscarPorCliente(id);
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

      <button onClick={() => salvarCliente(nome)}>
        {clienteEditando ? "Salvar Edição" : "Adicionar Cliente"}
      </button>

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nome}

            <button onClick={() => iniciarEdicao(cliente)}>
              Editar
            </button>

            <button onClick={() => deletarCliente(cliente.id!)}>
              Excluir
            </button>

            <button onClick={() => selecionarCliente(cliente.id!)}>
              Ver veículos
            </button>
          </li>

        ))}
      </ul>

      {clienteSelecionado && (
        <div>
          <h3>Veículos do Cliente</h3>

          <input
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />

          <input
            placeholder="Placa"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
          />

          <input
            placeholder="Cor"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
          />

          <button
            onClick={() => {
              if (!clienteSelecionado) return;

              adicionarVeiculo({
                modelo,
                placa,
                cor,
                clienteId: clienteSelecionado
              });

              setModelo("");
              setPlaca("");
              setCor("");
            }}
          >
            Adicionar Veículo
          </button>

          <ul>
            {veiculos.map((v) => (
              <li key={v.id}>
                {v.modelo} - {v.placa}
              </li>
            ))}
          </ul>
        </div>
      )}



    </div>
  );
}