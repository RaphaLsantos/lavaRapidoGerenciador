import { useEffect, useState } from "react";
import { useDespesas } from "../hooks/useDespesas";
import type { Despesa } from "../types/SaaS";

export default function Despesas() {
    const { despesas, buscarTodas, adicionarDespesa, deletarDespesa, calcularTotalDespesas } = useDespesas();
    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState(0);
    const [categoria, setCategoria] = useState<Despesa["categoria"]>("Produtos");

    useEffect(() => {
        buscarTodas();
    }, []);

    const handleAdicionarDespesa = async () => {
        if (!descricao || valor <= 0) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        await adicionarDespesa({
            descricao,
            valor,
            categoria,
            data: new Date().toISOString()
        });

        setDescricao("");
        setValor(0);
        setCategoria("Produtos");
    };

    const despesasDoMes = despesas.filter(d => {
        const data = new Date(d.data);
        return data.getMonth() === mesSelecionado && data.getFullYear() === anoSelecionado;
    });

    const despesasPorCategoria = despesasDoMes.reduce((acc, d) => {
        if (!acc[d.categoria]) acc[d.categoria] = [];
        acc[d.categoria].push(d);
        return acc;
    }, {} as Record<Despesa["categoria"], Despesa[]>);

    const totalDespesas = calcularTotalDespesas(despesasDoMes);

    const getCategoryColor = (categoria: Despesa["categoria"]) => {
        const colors: Record<Despesa["categoria"], string> = {
            "Aluguel": "from-red-300 to-red-200",
            "Produtos": "from-blue-300 to-blue-200",
            "Salários": "from-purple-300 to-purple-200",
            "Energia": "from-yellow-300 to-yellow-200",
            "Manutenção": "from-orange-300 to-orange-200",
            "Outros": "from-gray-300 to-gray-200"
        };
        return colors[categoria] || "from-gray-300 to-gray-200";
    };

    const getCategoryIcon = (categoria: Despesa["categoria"]) => {
        const icons: Record<Despesa["categoria"], string> = {
            "Aluguel": "fa-building",
            "Produtos": "fa-box",
            "Salários": "fa-money-bill-wave",
            "Energia": "fa-bolt",
            "Manutenção": "fa-wrench",
            "Outros": "fa-ellipsis"
        };
        return icons[categoria] || "fa-circle";
    };

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-black text-gray-900">Controle de Despesas</h1>

            {/* Formulário de Nova Despesa */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Registrar Nova Despesa</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    />
                    <input
                        type="number"
                        placeholder="Valor (R$)"
                        value={valor}
                        onChange={(e) => setValor(Number(e.target.value))}
                        className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    />
                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value as Despesa["categoria"])}
                        className="px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    >
                        <option value="Aluguel">Aluguel</option>
                        <option value="Produtos">Produtos</option>
                        <option value="Salários">Salários</option>
                        <option value="Energia">Energia</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Outros">Outros</option>
                    </select>
                    <div></div>
                    <button
                        onClick={handleAdicionarDespesa}
                        className="px-6 py-3 bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        <i className="fa-solid fa-plus mr-2"></i>Registrar
                    </button>
                </div>
            </div>

            {/* Filtro de Mês/Ano */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <select
                        value={mesSelecionado}
                        onChange={(e) => setMesSelecionado(Number(e.target.value))}
                        className="px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-400 focus:outline-none font-semibold"
                    >
                        {meses.map((mes, idx) => (
                            <option key={mes} value={idx}>{mes}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                        className="px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-400 focus:outline-none font-semibold w-24 text-center"
                    />
                </div>
                <div className="text-center md:text-right">
                    <p className="text-sm text-gray-600 font-semibold">Total de Despesas</p>
                    <p className="text-4xl font-black text-red-600">R$ {totalDespesas.toFixed(2)}</p>
                </div>
            </div>

            {/* Resumo por Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(despesasPorCategoria).map(([cat, despesasCategoria]) => (
                    <div key={cat} className={`bg-gradient-to-br ${getCategoryColor(cat as Despesa["categoria"])} rounded-2xl shadow-md border-2 border-white p-6`}>
                        <div className="flex items-center gap-3 mb-3">
                            <i className={`fa-solid ${getCategoryIcon(cat as Despesa["categoria"])} text-3xl text-white drop-shadow-md`}></i>
                            <h3 className="text-lg font-bold text-white drop-shadow-sm">{cat}</h3>
                        </div>
                        <p className="text-3xl font-black text-white drop-shadow-md">
                            R$ {calcularTotalDespesas(despesasCategoria).toFixed(2)}
                        </p>
                        <p className="text-sm text-white/80 mt-2 font-semibold">{despesasCategoria.length} item(ns)</p>
                    </div>
                ))}
            </div>

            {/* Lista Detalhada de Despesas */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Despesas de {meses[mesSelecionado]} de {anoSelecionado}</h2>

                {despesasDoMes.length === 0 ? (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                        <i className="fa-solid fa-inbox text-5xl text-blue-400 mb-4"></i>
                        <p className="text-gray-600 font-semibold">Nenhuma despesa registrada neste período</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Object.entries(despesasPorCategoria).map(([categoria, despesasCategoria]) => (
                            <div key={categoria} className="space-y-2">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <i className={`fa-solid ${getCategoryIcon(categoria as Despesa["categoria"])} text-blue-400`}></i>
                                    {categoria}
                                </h3>
                                <div className="space-y-2 pl-8">
                                    {despesasCategoria.map(d => (
                                        <div key={d.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900">{d.descricao}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(d.data).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-2xl font-black text-red-600">R$ {d.valor.toFixed(2)}</p>
                                                <button
                                                    onClick={() => deletarDespesa(d.id)}
                                                    className="px-3 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
