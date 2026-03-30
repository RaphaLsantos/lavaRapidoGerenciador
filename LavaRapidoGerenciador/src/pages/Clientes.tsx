import { useEffect, useState } from "react";
import { useClientes } from "../hooks/UseClientes";
import { useVeiculos } from "../hooks/UseVeiculos";
import Servicos from "./Servicos";
import HistoricoCliente from "./HistoricoCliente";
import Modal from "../components/Modal";

export default function Clientes() {
  const [nome, setNome] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(null);
  const [isVeiculosModalOpen, setIsVeiculosModalOpen] = useState(false);
  const [clienteModalInfo, setClienteModalInfo] = useState<any>(null);

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
    adicionarVeiculo,
    deletarVeiculo
  } = useVeiculos();

  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");

  useEffect(() => {
    if (clienteEditando) {
      setNome(clienteEditando.nome);
    } else {
      setNome("");
    }
  }, [clienteEditando]);

  function abrirModalVeiculos(cliente: any) {
    setClienteModalInfo(cliente);
    setClienteSelecionado(cliente.id);
    buscarPorCliente(cliente.id);
    setIsVeiculosModalOpen(true);
  }

  function fecharModalVeiculos() {
    setIsVeiculosModalOpen(false);
    setClienteModalInfo(null);
    setModelo("");
    setPlaca("");
    setCor("");
  }

  function adicionarNovoVeiculo() {
    if (!clienteSelecionado || !modelo || !placa || !cor) {
      alert("Preencha todos os campos!");
      return;
    }
    adicionarVeiculo({
      modelo,
      placa,
      cor,
      clienteId: clienteSelecionado
    });
    setModelo("");
    setPlaca("");
    setCor("");
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
                    onClick={() => abrirModalVeiculos(cliente)}
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

      {/* Modal de Veículos */}
      <Modal 
        isOpen={isVeiculosModalOpen}
        onClose={fecharModalVeiculos}
        title={`Veículos de ${clienteModalInfo?.nome || 'Cliente'}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Formulário de Adição de Veículo */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fa-solid fa-plus text-blue-400 mr-2"></i>
              Adicionar Novo Veículo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                placeholder="Modelo (ex: Corolla)"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
              />
              <input
                placeholder="Placa (ex: ABC-1234)"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
              />
              <input
                placeholder="Cor (ex: Preto)"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
              />
              <button
                onClick={adicionarNovoVeiculo}
                className="px-4 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-md"
              >
                <i className="fa-solid fa-plus mr-2"></i>Adicionar
              </button>
            </div>
          </div>

          {/* Lista de Veículos */}
          <div className="space-y-4">
            {veiculos.length === 0 ? (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                <i className="fa-solid fa-car text-4xl text-blue-300 mb-3 block"></i>
                <p className="text-gray-600 font-semibold">Nenhum veículo cadastrado para este cliente</p>
              </div>
            ) : (
              veiculos.map((v) => (
                <div key={v.id} className="bg-gradient-to-r from-blue-50 to-white rounded-xl border-2 border-blue-100 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                        <i className="fa-solid fa-car text-2xl text-white"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900">{v.modelo}</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p><span className="font-semibold text-gray-900">Placa:</span> {v.placa}</p>
                          <p><span className="font-semibold text-gray-900">Cor:</span> {v.cor}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja excluir o veículo ${v.modelo}?`)) {
                          deletarVeiculo(v.id!);
                        }
                      }}
                      className="px-3 py-2 bg-red-400 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors duration-200 text-sm"
                    >
                      <i className="fa-solid fa-trash mr-1"></i>Excluir
                    </button>
                  </div>

                  {/* Serviços do Veículo */}
                  <div className="mt-4 pt-4 border-t-2 border-blue-100">
                    <Servicos veiculoId={v.id!} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
