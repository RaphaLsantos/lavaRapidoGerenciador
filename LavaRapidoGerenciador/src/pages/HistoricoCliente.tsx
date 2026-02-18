import { useEffect, useState } from "react";
import { useSaaS } from "../hooks/useSaaS";
import type { Servico } from "../types/Servico";

interface HistoricoProps {
    clienteId: string | number;
}

export default function HistoricoCliente({ clienteId }: HistoricoProps) {
    const { buscarHistoricoCliente } = useSaaS();
    const [historico, setHistorico] = useState<Servico[]>([]);

    useEffect(() => {
        buscarHistoricoCliente(clienteId).then(setHistorico);
    }, [clienteId, buscarHistoricoCliente]);

    return (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            <h5 style={{ margin: '0 0 10px 0' }}>Histórico de Serviços</h5>
            {historico.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#999' }}>Nenhum serviço realizado ainda.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {historico.map(s => (
                        <li key={s.id} style={{ fontSize: '13px', padding: '5px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{new Date(s.dataCriacao).toLocaleDateString()} - {s.descricao}</span>
                            <span style={{ fontWeight: 'bold' }}>R$ {s.valor.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
