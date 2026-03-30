import { useEffect, useState, useCallback } from "react";
import { useServicos } from "../hooks/useServicos";
import { usePagamentos } from "../hooks/usePagamentos";
import type { Pagamento, FormaPagamento } from "../types/Pagamentos";

interface ServicosProps {
    veiculoId: string | number;
}

export default function Servicos({ veiculoId }: ServicosProps) {
    const { servicos, buscarPorVeiculo, adicionarServico, atualizarStatus } = useServicos();
    const { adicionarPagamento, buscarTodosPagamentos } = usePagamentos();
    
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState(0);
    const [pagamentosMap, setPagamentosMap] = useState<Record<string | number, Pagamento[]>>({});

    const carregarDados = useCallback(async () => {
        await buscarPorVeiculo(veiculoId);
        const todosPagamentos = await buscarTodosPagamentos();
        
        const map: Record<string | number, Pagamento[]> = {};
        todosPagamentos.forEach((p: Pagamento) => {
            if (!map[p.servicoId]) map[p.servicoId] = [];
            map[p.servicoId].push(p);
        });
        setPagamentosMap(map);
    }, [veiculoId, buscarPorVeiculo, buscarTodosPagamentos]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const handleAddServico = async () => {
        if (!descricao || valor <= 0) return;
        await adicionarServico({
            descricao,
            valor,
            veiculoId,
            status: "Em andamento",
            dataCriacao: new Date().toISOString()
        });
        setDescricao("");
        setValor(0);
    };

    const handleAddPagamento = async (servicoId: string | number, valorPago: number, forma: FormaPagamento) => {
        await adicionarPagamento({
            servicoId,
            valorPago,
            formaPagamento: forma,
            data: new Date().toISOString()
        });
        carregarDados();
    };

    const calcularTotalPago = (servicoId: string | number) => {
        return (pagamentosMap[servicoId] || []).reduce((acc, p) => acc + p.valorPago, 0);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Serviços do Veículo</h3>
            
            {/* Formulário de Adição */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 flex flex-col md:flex-row gap-3">
                <input 
                    placeholder="Descrição do serviço" 
                    value={descricao} 
                    onChange={e => setDescricao(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                />
                <input 
                    type="number" 
                    placeholder="Valor (R$)" 
                    value={valor} 
                    onChange={e => setValor(Number(e.target.value))}
                    className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none w-32"
                />
                <button 
                    onClick={handleAddServico}
                    className="px-6 py-2 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap"
                >
                    <i className="fa-solid fa-plus mr-2"></i>Adicionar
                </button>
            </div>

            {/* Lista de Serviços */}
            <div className="space-y-3">
                {servicos.length === 0 ? (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-gray-600 font-semibold">Nenhum serviço cadastrado</p>
                    </div>
                ) : (
                    servicos.map(s => {
                        const totalPago = calcularTotalPago(s.id!);
                        const quitado = totalPago >= s.valor && s.status === "Finalizado";
                        const restante = s.valor - totalPago;
                        
                        return (
                            <div key={s.id} className="bg-white border-2 border-blue-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                {/* Header do Serviço */}
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-900">{s.descricao}</h4>
                                        <p className="text-sm text-gray-600 mt-1">Valor: <span className="font-bold text-blue-600">R$ {s.valor.toFixed(2)}</span></p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className={`
                                            px-4 py-2 rounded-lg font-bold text-sm
                                            ${s.status === "Finalizado" 
                                                ? "bg-green-100 text-green-700 border border-green-300" 
                                                : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                            }
                                        `}>
                                            {s.status}
                                        </span>
                                        {quitado && (
                                            <span className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-sm border border-emerald-300">
                                                <i className="fa-solid fa-check mr-1"></i>QUITADO
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Informações de Pagamento */}
                                <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 font-semibold">Pago</p>
                                            <p className="text-lg font-bold text-green-600">R$ {totalPago.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-semibold">Restante</p>
                                            <p className={`text-lg font-bold ${restante > 0 ? "text-red-600" : "text-green-600"}`}>
                                                R$ {restante.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-semibold">Progresso</p>
                                            <p className="text-lg font-bold text-blue-600">{((totalPago / s.valor) * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Barra de Progresso */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-full transition-all duration-300"
                                        style={{ width: `${Math.min((totalPago / s.valor) * 100, 100)}%` }}
                                    ></div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <button 
                                        disabled={s.status === "Finalizado"}
                                        onClick={() => atualizarStatus(s.id!, "Finalizado")}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                            s.status === "Finalizado"
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-emerald-400 text-white hover:bg-emerald-500"
                                        }`}
                                    >
                                        <i className="fa-solid fa-check mr-2"></i>Finalizar
                                    </button>
                                    
                                    {totalPago < s.valor && (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    const v = prompt("Valor do pagamento:");
                                                    if (v) handleAddPagamento(s.id!, Number(v), "Dinheiro");
                                                }}
                                                className="px-4 py-2 bg-blue-300 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
                                            >
                                                <i className="fa-solid fa-money-bill mr-2"></i>Pagar Parcial
                                            </button>
                                            <button 
                                                onClick={() => handleAddPagamento(s.id!, s.valor - totalPago, "PIX")}
                                                className="px-4 py-2 bg-purple-400 text-white rounded-lg font-semibold hover:bg-purple-500 transition-colors"
                                            >
                                                <i className="fa-solid fa-mobile mr-2"></i>Quitar (PIX)
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Histórico de Pagamentos */}
                                {pagamentosMap[s.id!] && pagamentosMap[s.id!].length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <p className="text-sm font-bold text-gray-900 mb-2">
                                            <i className="fa-solid fa-history mr-2"></i>Histórico de Pagamentos
                                        </p>
                                        <div className="space-y-1">
                                            {pagamentosMap[s.id!].map((p, idx) => (
                                                <div key={idx} className="text-xs text-gray-700 flex justify-between">
                                                    <span>
                                                        <span className="font-semibold">{new Date(p.data).toLocaleDateString('pt-BR')}</span>
                                                        {" - "}
                                                        <span className="text-blue-600 font-semibold">{p.formaPagamento}</span>
                                                    </span>
                                                    <span className="font-bold text-green-600">R$ {p.valorPago.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
