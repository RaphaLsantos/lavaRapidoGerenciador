import { useEffect, useState, useMemo } from "react";
import { useServicos } from "../hooks/useServicos";
import { usePagamentos } from "../hooks/usePagamentos";
import { useSaaS } from "../hooks/useSaaS";
import { api } from "../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import type { Pagamento } from "../types/Pagamentos";
import type { Servico } from "../types/Servico";

export default function Dashboard() {
    const { buscarTodosServicos } = useServicos();
    const { buscarTodosPagamentos } = usePagamentos();
    const { buscarDespesas } = useSaaS();

    const [clientesCount, setClientesCount] = useState(0);
    const [veiculosCount, setVeiculosCount] = useState(0);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [despesas, setDespesas] = useState<any[]>([]);

    // Filtro de Mês/Ano
    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

    useEffect(() => {
        async function carregarDados() {
            const [s, p, c, v, d] = await Promise.all([
                buscarTodosServicos(),
                buscarTodosPagamentos(),
                api.get("/clientes"),
                api.get("/veiculos"),
                buscarDespesas()
            ]);

            setServicos(s);
            setPagamentos(p);
            setDespesas(d);
            setClientesCount(c.data.length);
            setVeiculosCount(v.data.length);
        }

        carregarDados();
    }, [buscarTodosServicos, buscarTodosPagamentos]);

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

        const totalFaturado = pagamentosNoMes.reduce((acc, p) => acc + p.valorPago, 0);

        const totalDespesas = despesas
            .filter(d => {
                const data = new Date(d.data);
                return data.getMonth() === mesSelecionado && data.getFullYear() === anoSelecionado;
            })
            .reduce((acc, d) => acc + d.valor, 0);

        const lucroLiquido = totalFaturado - totalDespesas;

        // Total pendente: Valor total dos serviços finalizados no mês - total pago por esses serviços
        const totalPendente = servicosNoMes
            .filter(s => s.status === "Finalizado")
            .reduce((acc, s) => {
                const pagoPeloServico = pagamentos
                    .filter(p => p.servicoId === s.id)
                    .reduce((sum, p) => sum + p.valorPago, 0);
                return acc + (s.valor - pagoPeloServico);
            }, 0);

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
            dadosGrafico
        };
    }, [pagamentos, servicos, mesSelecionado, anoSelecionado]);

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

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

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card title="Total Clientes" value={clientesCount} iconClass="fa-user" bgColor="from-blue-300 to-blue-200" /> 
                <Card title="Total Veículos" value={veiculosCount} iconClass="fa-car" bgColor="from-blue-300 to-blue-200" />
                <Card title="Faturado no Mês" value={`R$ ${dadosFiltrados.totalFaturado.toFixed(2)}`} iconClass="fa-up-long" bgColor="from-green-300 to-green-200" />
                <Card title="Pendente no Mês" value={`R$ ${dadosFiltrados.totalPendente.toFixed(2)}`} iconClass="fa-down-long" bgColor="from-red-300 to-red-200" />
                <Card title="Recebido Hoje" value={`R$ ${dadosFiltrados.totalHoje.toFixed(2)}`} iconClass="fa-coins" bgColor="from-yellow-300 to-yellow-200" />
                <Card title="Despesas Mês" value={`R$ ${dadosFiltrados.totalDespesas.toFixed(2)}`} iconClass="fa-money-bill" bgColor="from-orange-300 to-orange-200" />
                <Card title="Lucro Líquido" value={`R$ ${dadosFiltrados.lucroLiquido.toFixed(2)}`} iconClass="fa-chart-line" bgColor={dadosFiltrados.lucroLiquido >= 0 ? "from-emerald-300 to-emerald-200" : "from-red-300 to-red-200"} />
            </div>

            {/* Gráfico */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Gráfico de Fluxo de Caixa (Mensal)</h2>
                <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosFiltrados.dadosGrafico}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="dia" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#F3F4F6', border: '2px solid #93C5FD', borderRadius: '8px' }}
                                formatter={(value) => `R$ ${value.toFixed(2)}`}
                            />
                            <Bar dataKey="valor" fill="#60A5FA" radius={[8, 8, 0, 0]} name="Valor Recebido" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
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
