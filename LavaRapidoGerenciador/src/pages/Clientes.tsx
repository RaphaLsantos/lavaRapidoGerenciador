import { useEffect, useState } from "react";
import { useClientes } from "../hooks/UseClientes";
import { useVeiculos } from "../hooks/UseVeiculos";
import Servicos from "./Servicos";
import HistoricoCliente from "./HistoricoCliente";

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-6">Gerenciar Clientes</h1>
        
        {/* Formulário de Adição/Edição */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {clienteEditando ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Nome do cliente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
            />
            <button 
              onClick={() => salvarCliente(nome)}
              className="px-6 py-3 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors duration-200 shadow-md"
            >
              {clienteEditando ? "Salvar Edição" : "Adicionar"}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="space-y-4">
        {clientes.length === 0 ? (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
            <p className="text-gray-600 font-semibold">Nenhum cliente cadastrado ainda</p>
          </div>
        ) : (
          clientes.map((cliente) => (
            <div key={cliente.id} className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{cliente.nome}</h3>
                  <p className="text-sm text-gray-500 mt-1">ID: {cliente.id}</p>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={() => iniciarEdicao(cliente)}
                    className="px-4 py-2 bg-blue-300 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors duration-200"
                  >
                    <i className="fa-solid fa-pen-to-square mr-2"></i>Editar
                  </button>
                  <button 
                    onClick={() => selecionarCliente(cliente.id!)}
                    className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors duration-200"
                  >
                    <i className="fa-solid fa-car mr-2"></i>Veículos
                  </button>
                  <button 
                    onClick={() => deletarCliente(cliente.id!)}
                    className="px-4 py-2 bg-red-400 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors duration-200"
                  >
                    <i className="fa-solid fa-trash mr-2"></i>Excluir
                  </button>
                </div>
              </div>

              {/* Histórico do Cliente */}
              <div className="mt-4 pt-4 border-t border-blue-100">
                <HistoricoCliente clienteId={cliente.id!} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Seção de Veículos */}
      {clienteSelecionado && (
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Veículos do Cliente</h2>

          {/* Formulário de Adição de Veículo */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Adicionar Novo Veículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                placeholder="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
              />
              <input
                placeholder="Placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
              />
              <input
                placeholder="Cor"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
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
                className="px-4 py-2 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
              >
                <i className="fa-solid fa-plus mr-2"></i>Adicionar
              </button>
            </div>
          </div>

          {/* Lista de Veículos */}
          <div className="space-y-4">
            {veiculos.length === 0 ? (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                <p className="text-gray-600 font-semibold">Nenhum veículo cadastrado</p>
              </div>
            ) : (
              veiculos.map((v) => (
                <div key={v.id} className="bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <i className="fa-solid fa-car text-3xl text-blue-400"></i>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{v.modelo}</h4>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Placa:</span> {v.placa} | <span className="font-semibold">Cor:</span> {v.cor}
                      </p>
                    </div>
                  </div>
                  <Servicos veiculoId={v.id!} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
