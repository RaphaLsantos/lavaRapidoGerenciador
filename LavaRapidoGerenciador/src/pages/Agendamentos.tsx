import { useEffect, useState } from "react";
import { useAgendamentos } from "../hooks/useAgendamentos";
import { useSaaS } from "../hooks/useSaaS";
import { useClientes } from "../hooks/UseClientes";
import { useVeiculos } from "../hooks/UseVeiculos";
import type { Agendamento } from "../types/SaaS";

export default function Agendamentos() {
    const { agendamentos, buscarTodos, adicionarAgendamento, atualizarStatus, deletarAgendamento } = useAgendamentos();
    const { buscarPrecos } = useSaaS();
    const { clientes } = useClientes();
    const { veiculos } = useVeiculos();

    const [precos, setPrecos] = useState<any[]>([]);
    const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
    const [clienteId, setClienteId] = useState("");
    const [veiculoId, setVeiculoId] = useState("");
    const [servicoTipoId, setServicoTipoId] = useState("");

    useEffect(() => {
        buscarTodos();
        buscarPrecos().then(setPrecos);
    }, []);

    const handleAdicionarAgendamento = async () => {
        if (!clienteId || !veiculoId || !servicoTipoId) {
            alert("Preencha todos os campos!");
            return;
        }

        await adicionarAgendamento({
            clienteId,
            veiculoId,
            servicoTipoId,
            dataHora: new Date(dataSelecionada).toISOString(),
            status: "Confirmado"
        });

        setClienteId("");
        setVeiculoId("");
        setServicoTipoId("");
    };

    const agendamentosDodia = agendamentos.filter(a => {
        const dataAgendamento = new Date(a.dataHora).toDateString();
        const dataFiltro = new Date(dataSelecionada).toDateString();
        return dataAgendamento === dataFiltro;
    });

    const agendadosHoje = agendamentosDodia.filter(a => a.status === "Pendente" || a.status === "Confirmado");
    const concluidos = agendamentosDodia.filter(a => a.status === "Concluído");
    const cancelados = agendamentosDodia.filter(a => a.status === "Cancelado");

    const getStatusColor = (status: Agendamento["status"]) => {
        const colors: Record<string, string> = {
            "Pendente": "from-yellow-300 to-yellow-200",
            "Confirmado": "from-blue-300 to-blue-200",
            "Concluído": "from-green-300 to-green-200",
            "Cancelado": "from-red-300 to-red-200"
        };
        return colors[status] || "from-gray-300 to-gray-200";
    };

    const getStatusIcon = (status: Agendamento["status"]) => {
        const icons: Record<string, string> = {
            "Pendente": "fa-hourglass-end",
            "Confirmado": "fa-check-circle",
            "Concluído": "fa-check-double",
            "Cancelado": "fa-times-circle"
        };
        return icons[status] || "fa-circle";
    };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-black text-gray-900">Agendamentos</h1>

            {/* Formulário de Novo Agendamento */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Novo Agendamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                        type="date"
                        value={dataSelecionada}
                        onChange={(e) => setDataSelecionada(e.target.value)}
                        className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    />
                    <select
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                        className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    >
                        <option value="">Selecione Cliente</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                    <select
                        value={veiculoId}
                        onChange={(e) => setVeiculoId(e.target.value)}
                        className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    >
                        <option value="">Selecione Veículo</option>
                        {veiculos.filter(v => v.clienteId === clienteId).map(v => (
                            <option key={v.id} value={v.id}>{v.modelo} - {v.placa}</option>
                        ))}
                    </select>
                    <select
                        value={servicoTipoId}
                        onChange={(e) => setServicoTipoId(e.target.value)}
                        className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    >
                        <option value="">Selecione Serviço</option>
                        {precos.map(p => (
                            <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco.toFixed(2)}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdicionarAgendamento}
                        className="px-6 py-3 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        <i className="fa-solid fa-plus mr-2"></i>Agendar
                    </button>
                </div>
            </div>

            {/* Seletor de Data */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
                <p className="text-sm text-gray-600 font-semibold mb-2">Data Selecionada</p>
                <p className="text-2xl font-black text-blue-600">
                    {new Date(dataSelecionada).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Resumo do Dia */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-300 to-blue-200 rounded-2xl shadow-md border-2 border-white p-6">
                    <p className="text-sm text-gray-700 font-bold uppercase mb-2">Agendados</p>
                    <p className="text-4xl font-black text-white">{agendadosHoje.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-300 to-green-200 rounded-2xl shadow-md border-2 border-white p-6">
                    <p className="text-sm text-gray-700 font-bold uppercase mb-2">Concluídos</p>
                    <p className="text-4xl font-black text-white">{concluidos.length}</p>
                </div>
                <div className="bg-gradient-to-br from-red-300 to-red-200 rounded-2xl shadow-md border-2 border-white p-6">
                    <p className="text-sm text-gray-700 font-bold uppercase mb-2">Cancelados</p>
                    <p className="text-4xl font-black text-white">{cancelados.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-300 to-purple-200 rounded-2xl shadow-md border-2 border-white p-6">
                    <p className="text-sm text-gray-700 font-bold uppercase mb-2">Total</p>
                    <p className="text-4xl font-black text-white">{agendamentosDodia.length}</p>
                </div>
            </div>

            {/* Abas de Status */}
            <div className="space-y-6">
                {/* Agendados */}
                <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <i className="fa-solid fa-calendar-check text-blue-400 text-3xl"></i>
                        Agendados para Hoje
                    </h3>
                    <div className="space-y-3">
                        {agendadosHoje.length === 0 ? (
                            <p className="text-gray-600 font-semibold text-center py-6">Nenhum agendamento para hoje</p>
                        ) : (
                            agendadosHoje.map(a => (
                                <AgendamentoCard
                                    key={a.id}
                                    agendamento={a}
                                    clientes={clientes}
                                    veiculos={veiculos}
                                    precos={precos}
                                    onStatusChange={atualizarStatus}
                                    onDelete={deletarAgendamento}
                                    statusColor={getStatusColor(a.status)}
                                    statusIcon={getStatusIcon(a.status)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Concluídos */}
                {concluidos.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <i className="fa-solid fa-check-double text-green-400 text-3xl"></i>
                            Concluídos Hoje
                        </h3>
                        <div className="space-y-3">
                            {concluidos.map(a => (
                                <AgendamentoCard
                                    key={a.id}
                                    agendamento={a}
                                    clientes={clientes}
                                    veiculos={veiculos}
                                    precos={precos}
                                    onStatusChange={atualizarStatus}
                                    onDelete={deletarAgendamento}
                                    statusColor={getStatusColor(a.status)}
                                    statusIcon={getStatusIcon(a.status)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Cancelados */}
                {cancelados.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md border border-red-100 p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <i className="fa-solid fa-times-circle text-red-400 text-3xl"></i>
                            Cancelados Hoje
                        </h3>
                        <div className="space-y-3">
                            {cancelados.map(a => (
                                <AgendamentoCard
                                    key={a.id}
                                    agendamento={a}
                                    clientes={clientes}
                                    veiculos={veiculos}
                                    precos={precos}
                                    onStatusChange={atualizarStatus}
                                    onDelete={deletarAgendamento}
                                    statusColor={getStatusColor(a.status)}
                                    statusIcon={getStatusIcon(a.status)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface AgendamentoCardProps {
    agendamento: Agendamento;
    clientes: any[];
    veiculos: any[];
    precos: any[];
    onStatusChange: (id: string | number, status: Agendamento["status"]) => void;
    onDelete: (id: string | number) => void;
    statusColor: string;
    statusIcon: string;
}

function AgendamentoCard({
    agendamento,
    clientes,
    veiculos,
    precos,
    onStatusChange,
    onDelete,
    statusColor,
    statusIcon
}: AgendamentoCardProps) {
    const cliente = clientes.find(c => c.id === agendamento.clienteId);
    const veiculo = veiculos.find(v => v.id === agendamento.veiculoId);
    const servico = precos.find(p => p.id === agendamento.servicoTipoId);

    return (
        <div className={`bg-gradient-to-r ${statusColor} rounded-xl p-4 border-2 border-white shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <i className={`fa-solid ${statusIcon} text-2xl text-white drop-shadow-md`}></i>
                        <div>
                            <p className="text-lg font-bold text-white drop-shadow-sm">{cliente?.nome}</p>
                            <p className="text-sm text-white/90">{veiculo?.modelo} - {veiculo?.placa}</p>
                        </div>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">
                        <i className="fa-solid fa-wrench mr-2"></i>
                        {servico?.nome} - R$ {servico?.preco.toFixed(2)}
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {agendamento.status !== "Concluído" && (
                        <button
                            onClick={() => onStatusChange(agendamento.id, "Concluído")}
                            className="px-4 py-2 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
                        >
                            <i className="fa-solid fa-check mr-1"></i>Concluir
                        </button>
                    )}
                    {agendamento.status !== "Cancelado" && (
                        <button
                            onClick={() => onStatusChange(agendamento.id, "Cancelado")}
                            className="px-4 py-2 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <i className="fa-solid fa-times mr-1"></i>Cancelar
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(agendamento.id)}
                        className="px-4 py-2 bg-white text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
