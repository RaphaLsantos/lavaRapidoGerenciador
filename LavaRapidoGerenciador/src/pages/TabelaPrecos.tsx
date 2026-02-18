import { useEffect, useState } from "react";
import { useSaaS } from "../hooks/useSaaS";
import type { PrecoServico } from "../types/SaaS";

export default function TabelaPrecos() {
    const { buscarPrecos } = useSaaS();
    const [precos, setPrecos] = useState<PrecoServico[]>([]);

    useEffect(() => {
        buscarPrecos().then(setPrecos);
    }, [buscarPrecos]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Tabela de Preços (SaaS)</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Serviço</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Categoria</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    {precos.map(p => (
                        <tr key={p.id}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{p.nome}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                <span style={{ 
                                    padding: '4px 8px', 
                                    borderRadius: '12px', 
                                    fontSize: '12px',
                                    backgroundColor: p.categoria === 'Lavagem' ? '#e3f2fd' : '#f3e5f5'
                                }}>
                                    {p.categoria}
                                </span>
                            </td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                                R$ {p.preco.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
