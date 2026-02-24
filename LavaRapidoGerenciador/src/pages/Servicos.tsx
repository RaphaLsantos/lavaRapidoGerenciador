import { useEffect, useState, useCallback } from "react";
import { useServicos } from "../hooks/useServicos";
import { usePagamentos } from "../hooks/usePagamentos";
import type { Servico, StatusServico } from "../types/Servico";
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
        todosPagamentos.forEach(p => {
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
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>Serviços do Veículo</h4>
            
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <input 
                    placeholder="Descrição do serviço" 
                    value={descricao} 
                    onChange={e => setDescricao(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder="Valor" 
                    value={valor} 
                    onChange={e => setValor(Number(e.target.value))} 
                />
                <button onClick={handleAddServico}>Adicionar Serviço</button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {servicos.map(s => {
                    const totalPago = calcularTotalPago(s.id!);
                    const quitado = totalPago >= s.valor && s.status === "Finalizado";
                    
                    return (
                        <li key={s.id} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#ffffff', borderRadius: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>{s.descricao} - R$ {s.valor.toFixed(2)}</strong>
                                <span style={{ 
                                    padding: '2px 8px', 
                                    borderRadius: '4px', 
                                    fontSize: '12px',
                                    backgroundColor: s.status === "Finalizado" ? '#e8f5e9' : '#fff3e0',
                                    color: s.status === "Finalizado" ? '#2e7d32' : '#ef6c00'
                                }}>
                                    {s.status}
                                </span>
                            </div>

                            <div style={{ fontSize: '14px', margin: '5px 0' }}>
                                Pago: R$ {totalPago.toFixed(2)} | 
                                Restante: R$ {(s.valor - totalPago).toFixed(2)}
                                {quitado && <span style={{ color: 'green', marginLeft: '10px', fontWeight: 'bold' }}>✓ QUITADO</span>}
                            </div>

                            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                                <button 
                                    disabled={s.status === "Finalizado"}
                                    onClick={() => atualizarStatus(s.id!, "Finalizado")}
                                >
                                    Finalizar Serviço
                                </button>
                                
                                {totalPago < s.valor && (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => {
                                            const v = prompt("Valor do pagamento:");
                                            if (v) handleAddPagamento(s.id!, Number(v), "Dinheiro");
                                        }}>Pagar Parcial</button>
                                        <button onClick={() => handleAddPagamento(s.id!, s.valor - totalPago, "PIX")}>Quitar (PIX)</button>
                                    </div>
                                )}
                            </div>

                            {pagamentosMap[s.id!] && (
                                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                    <strong>Histórico:</strong>
                                    {pagamentosMap[s.id!].map((p, idx) => (
                                        <div key={idx}>{new Date(p.data).toLocaleDateString()} - {p.formaPagamento}: R$ {p.valorPago.toFixed(2)}</div>
                                    ))}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
