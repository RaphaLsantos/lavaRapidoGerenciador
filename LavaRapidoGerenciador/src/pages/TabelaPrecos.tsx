import { useEffect, useState } from "react";
import { useSaaS } from "../hooks/useSaaS";
import type { PrecoServico } from "../types/SaaS";

export default function TabelaPrecos() {
    const { buscarPrecos } = useSaaS();
    const [precos, setPrecos] = useState<PrecoServico[]>([]);

    useEffect(() => {
        buscarPrecos().then(setPrecos);
    }, [buscarPrecos]);

    // Agrupar preços por categoria
    const precosAgrupados = precos.reduce((acc, p) => {
        if (!acc[p.categoria]) acc[p.categoria] = [];
        acc[p.categoria].push(p);
        return acc;
    }, {} as Record<string, PrecoServico[]>);

    const getCategoryColor = (categoria: string) => {
        const colors: Record<string, string> = {
            'Lavagem': 'from-blue-300 to-blue-200',
            'Enceramento': 'from-purple-300 to-purple-200',
            'Detalhamento': 'from-pink-300 to-pink-200',
            'Proteção': 'from-green-300 to-green-200',
            'Limpeza Interna': 'from-yellow-300 to-yellow-200',
            'Outros': 'from-gray-300 to-gray-200'
        };
        return colors[categoria] || 'from-blue-300 to-blue-200';
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">Tabela de Preços</h1>
                <p className="text-gray-600 font-semibold">Plano SaaS - Serviços Disponíveis</p>
            </div>

            {precos.length === 0 ? (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
                    <i className="fa-solid fa-inbox text-5xl text-blue-400 mb-4"></i>
                    <p className="text-gray-600 font-semibold text-lg">Nenhum serviço cadastrado ainda</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(precosAgrupados).map(([categoria, servicos]) => (
                        <div key={categoria}>
                            <div className={`bg-gradient-to-r ${getCategoryColor(categoria)} rounded-2xl shadow-md border-2 border-white p-6 mb-4`}>
                                <h2 className="text-2xl font-black text-white drop-shadow-md flex items-center gap-3">
                                    <i className="fa-solid fa-tag text-3xl"></i>
                                    {categoria}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {servicos.map(p => (
                                    <div 
                                        key={p.id}
                                        className="bg-white rounded-2xl shadow-md border-2 border-blue-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 flex-1">{p.nome}</h3>
                                            <span className={`
                                                px-3 py-1 rounded-full text-xs font-bold
                                                ${getCategoryColor(categoria).includes('blue') ? 'bg-blue-100 text-blue-700' : 
                                                  getCategoryColor(categoria).includes('purple') ? 'bg-purple-100 text-purple-700' :
                                                  getCategoryColor(categoria).includes('pink') ? 'bg-pink-100 text-pink-700' :
                                                  getCategoryColor(categoria).includes('green') ? 'bg-green-100 text-green-700' :
                                                  getCategoryColor(categoria).includes('yellow') ? 'bg-yellow-100 text-yellow-700' :
                                                  'bg-gray-100 text-gray-700'}
                                            `}>
                                                {categoria}
                                            </span>
                                        </div>

                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                            <p className="text-sm text-gray-600 font-semibold mb-1">Valor</p>
                                            <p className="text-4xl font-black text-blue-600">
                                                R$ {p.preco.toFixed(2)}
                                            </p>
                                        </div>

                                        <button className="w-full mt-4 px-4 py-3 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors duration-200 shadow-md">
                                            <i className="fa-solid fa-shopping-cart mr-2"></i>Selecionar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Resumo de Preços */}
            {precos.length > 0 && (
                <div className="bg-gradient-to-r from-blue-200 to-blue-300 rounded-2xl shadow-md border-2 border-white p-8">
                    <h3 className="text-2xl font-black text-white mb-6 drop-shadow-md">Resumo de Serviços</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-gray-600 font-semibold">Total de Serviços</p>
                            <p className="text-4xl font-black text-blue-600">{precos.length}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-gray-600 font-semibold">Categorias</p>
                            <p className="text-4xl font-black text-blue-600">{Object.keys(precosAgrupados).length}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-gray-600 font-semibold">Preço Médio</p>
                            <p className="text-4xl font-black text-blue-600">
                                R$ {(precos.reduce((acc, p) => acc + p.preco, 0) / precos.length).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
