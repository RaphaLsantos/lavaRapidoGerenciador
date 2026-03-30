import { useEffect, useState, useMemo } from "react";
import { useServicos } from "../hooks/useServicos";
import { usePagamentos } from "../hooks/usePagamentos";
import { useSaaS } from "../hooks/useSaaS";
import { useDespesas } from "../hooks/useDespesas";
import { api } from "../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import type { Pagamento } from "../types/Pagamentos";
import type { Servico } from "../types/Servico";

export default function Dashboard() {
    const { buscarTodosServicos } = useServicos();
    const { buscarTodosPagamentos } = usePagamentos();
    const { buscarDespesas, buscarPrecos } = useSaaS();
    const { buscarTodas: buscarDespesasAPI } = useDespesas();

    const [clientesCount, setClientesCount] = useState(0);
    const [veiculosCount, setVeiculosCount] = useState(0);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [despesas, setDespesas] = useState<any[]>([]);
    const [precos, setPrecos] = useState<any[]>([]);

    // Filtro de Mês/Ano
    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

    useEffect(() => {
        async function carregarDados() {
            const [s, p, c, v, d, pr] = await Promise.all([
                buscarTodosServicos(),
                buscarTodosPagamentos(),
                api.get("/clientes"),
                api.get("/veiculos"),
                buscarDespesasAPI(),
                buscarPrecos()
            ]);

            setServicos(s);
            setPagamentos(p);
            setDespesas(d);
            setPrecos(pr);
            setClientesCount(c.data.length);
            setVeiculosCount(v.data.length);
        }

        carregarDados();
    }, [buscarTodosServicos, buscarTodosPagamentos, buscarDespesasAPI, buscarPrecos]);

    // Lógica de Filtro e Cálculos
    const dadosFiltrados = useMemo(() => {
        const pagamentosNoMes = pagamentos.filter(p => {
            const data = new Date(p.data);
            return data.getMonth() === mesSelecionado && data.getFullYear() === anoSelecionado;
        });

        const servicosNoMes = servicos.filter(s => {
            const data = new Date(s.dataCriacao);
            return data.getMonth() === mesSelecionado && data.getFullYear() === anoSelecionado;
        });

        const servicosFinalizadosNoMes = servicosNoMes.filter(s => s.status === "Finalizado");

        const totalFaturado = pagamentosNoMes.reduce((acc, p) => acc + p.valorPago, 0);

        const totalDespesas = despesas
            .filter(d => {
                const data = new Date(d.data);
                return data.getMonth() === mesSelecionado && data.getFullYear() === anoSelecionado;
            })
            .reduce((acc, d) => acc + d.valor, 0);

        const lucroLiquido = totalFaturado - totalDespesas;

        // Ticket Médio
        const ticketMedio = servicosFinalizadosNoMes.length > 0 
            ? totalFaturado / servicosFinalizadosNoMes.length 
            : 0;

        // Total pendente
        const totalPendente = servicosFinalizadosNoMes
            .reduce((acc, s) => {
                const pagoPeloServico = pagamentos
                    .filter(p => p.servicoId === s.id)
                    .reduce((sum, p) => sum + p.valorPago, 0);
                return acc + (s.valor - pagoPeloServico);
            }, 0);

        // Serviços mais vendidos
        const servicosMaisVendidos = servicosFinalizadosNoMes.reduce((acc: any, s) => {
            const descricao = s.descricao;
            acc[descricao] = (acc[descricao] || 0) + 1;
            return acc;
        }, {});

        const servicosMaisVendidosArray = Object.entries(servicosMaisVendidos)
            .map(([nome, quantidade]) => ({ nome, quantidade }))
            .sort((a, b) => (b.quantidade as number) - (a.quantidade as number))
            .slice(0, 5);

        // Agrupamento por dia para o gráfico
        const faturamentoPorDia = pagamentosNoMes.reduce((acc: any, p) => {
            const dia = new Date(p.data).getDate();
            acc[dia] = (acc[dia] || 0) + p.valorPago;
            return acc;
        }, {});

        const dadosGrafico = Object.keys(faturamentoPorDia).map(dia => ({
            dia: `Dia ${dia}`,
            valor: faturamentoPorDia[dia]
        })).sort((a, b) => parseInt(a.dia.split(' ')[1]) - parseInt(b.dia.split(' ')[1]));

        // Caixa Diário (Hoje)
        const hoje = new Date();
        const totalHoje = pagamentos.filter(p => {
            const d = new Date(p.data);
            return d.getDate() === hoje.getDate() &&
                d.getMonth() === hoje.getMonth() &&
                d.getFullYear() === hoje.getFullYear();
        }).reduce((acc, p) => acc + p.valorPago, 0);

        return {
            totalFaturado,
            totalPendente,
            totalHoje,
            totalDespesas,
            lucroLiquido,
            dadosGrafico,
            ticketMedio,
            servicosFinalizados: servicosFinalizadosNoMes.length,
            servicosMaisVendidos: servicosMaisVendidosArray
        };
    }, [pagamentos, servicos, despesas, mesSelecionado, anoSelecionado]);

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'];

    return (
        <div className="flex flex-col gap-6">
            {/* Header com Título e Filtros */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-4xl font-black text-gray-900">Dashboard Profissional</h1>
                <div className="flex items-center gap-3 flex-wrap">
                    <select 
                        className="px-4 py-2 bg-blue-300 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors duration-200 cursor-pointer border-2 border-blue-400"
                        value={mesSelecionado}
                        onChange={(e) => setMesSelecionado(Number(e.target.value))}
                    >
                        {meses.map((mes, index) => (
                            <option key={mes} value={index}>{mes}</option>
                        ))}
                    </select>
                    <input 
                        className="px-4 py-2 bg-blue-300 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors duration-200 cursor-pointer border-2 border-blue-400 w-24 text-center"
                        type="number"
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Grid de Cards Principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card title="Total Clientes" value={clientesCount} iconClass="fa-user" bgColor="from-blue-300 to-blue-200" /> 
                <Card title="Total Veículos" value={veiculosCount} iconClass="fa-car" bgColor="from-blue-300 to-blue-200" />
                <Card title="Faturado no Mês" value={`R$ ${dadosFiltrados.totalFaturado.toFixed(2)}`} iconClass="fa-up-long" bgColor="from-green-300 to-green-200" />
                <Card title="Pendente no Mês" value={`R$ ${dadosFiltrados.totalPendente.toFixed(2)}`} iconClass="fa-down-long" bgColor="from-red-300 to-red-200" />
                <Card title="Recebido Hoje" value={`R$ ${dadosFiltrados.totalHoje.toFixed(2)}`} iconClass="fa-coins" bgColor="from-yellow-300 to-yellow-200" />
                <Card title="Despesas Mês" value={`R$ ${dadosFiltrados.totalDespesas.toFixed(2)}`} iconClass="fa-money-bill" bgColor="from-orange-300 to-orange-200" />
                <Card title="Lucro Líquido" value={`R$ ${dadosFiltrados.lucroLiquido.toFixed(2)}`} iconClass="fa-chart-line" bgColor={dadosFiltrados.lucroLiquido >= 0 ? "from-emerald-300 to-emerald-200" : "from-red-300 to-red-200"} />
                <Card title="Ticket Médio" value={`R$ ${dadosFiltrados.ticketMedio.toFixed(2)}`} iconClass="fa-receipt" bgColor="from-purple-300 to-purple-200" />
            </div>

            {/* Métricas Importantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Serviços Realizados</h3>
                    <p className="text-5xl font-black text-blue-600">{dadosFiltrados.servicosFinalizados}</p>
                    <p className="text-sm text-gray-600 mt-2">Serviços finalizados neste mês</p>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Margem de Lucro</h3>
                    <p className="text-5xl font-black text-emerald-600">
                        {dadosFiltrados.totalFaturado > 0 
                            ? ((dadosFiltrados.lucroLiquido / dadosFiltrados.totalFaturado) * 100).toFixed(1)
                            : 0}%
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Percentual de lucro sobre faturamento</p>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Clientes Ativos</h3>
                    <p className="text-5xl font-black text-blue-600">{clientesCount}</p>
                    <p className="text-sm text-gray-600 mt-2">Total de clientes cadastrados</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Faturamento */}
                <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Fluxo de Caixa (Mensal)</h2>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dadosFiltrados.dadosGrafico}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="dia" stroke="#6B7280" />
                                <YAxis stroke="#6B7280" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#F3F4F6', border: '2px solid #93C5FD', borderRadius: '8px' }}
                                    formatter={(value) => `R$ ${typeof value === 'number' ? value.toFixed(2) : value}`}
                                />
                                <Bar dataKey="valor" fill="#60A5FA" radius={[8, 8, 0, 0]} name="Valor Recebido" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Serviços Mais Vendidos */}
                {dadosFiltrados.servicosMaisVendidos.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Serviços Mais Vendidos</h2>
                        <div style={{ width: "100%", height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dadosFiltrados.servicosMaisVendidos}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, quantidade }) => `${name}: ${quantidade}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="quantidade"
                                    >
                                        {dadosFiltrados.servicosMaisVendidos.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} serviço(s)`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CardProps {
    title: string;
    value: string | number;
    iconClass?: string;
    bgColor?: string;
}

function Card({ title, value, iconClass, bgColor = "from-blue-300 to-blue-200" }: CardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
                bg-gradient-to-br ${bgColor} rounded-2xl shadow-md border-2 border-white
                p-6 transition-all duration-300 cursor-pointer
                ${isHovered ? "scale-105 shadow-lg" : ""}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">{title}</h3>
            {iconClass && (
                <i
                    className={`fa-solid ${iconClass} text-3xl text-white mb-3 drop-shadow-lg`}
                />
            )}
            <p className="text-3xl font-black text-white drop-shadow-md">{value}</p>
        </div>
    );
}
