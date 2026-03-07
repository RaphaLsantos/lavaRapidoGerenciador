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
        <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between mt-10">
                <h1 className="text-2xl font-bold">Dashboard Profissional</h1>
                <div className="flex items-center gap-4 md:flex-row md:items-start md:gap-2">
                    <select className="bg-blue-400 font-bold text-white p-1 rounded cursor-pointer hover:bg-blue-600 transition-colors duration-200 wd-40 text-center"
                        value={mesSelecionado}
                        onChange={(e) => setMesSelecionado(Number(e.target.value))}
                    >
                        {meses.map((mes, index) => (
                            <option key={mes} value={index}>{mes}</option>
                        ))}
                    </select>
                    <input className="wd-100 bg-blue-400 font-bold text-white p-1 rounded cursor-pointer hover:bg-blue-600 transition-colors duration-200 text-center "
                        type="number"
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 mt-15">
                <Card title="Total Clientes" value={clientesCount} iconClass="fa-user" /> 
                <Card title="Total Veículos" value={veiculosCount} iconClass="fa-car" />
                <Card title="Faturado no Mês" value={`R$ ${dadosFiltrados.totalFaturado.toFixed(2)}`} color="#4caf50" iconClass="fa-up-long" />
                <Card title="Pendente no Mês" value={`R$ ${dadosFiltrados.totalPendente.toFixed(2)}`} color="#f44336" iconClass="fa-down-long" />
                <Card title="Recebido Hoje" value={`R$ ${dadosFiltrados.totalHoje.toFixed(2)}`} color="#ff0000" iconClass="fa-coins" />
                <Card title="Despesas Mês" value={`R$ ${dadosFiltrados.totalDespesas.toFixed(2)}`} color="#ff9800" iconClass="fa-money-bill" />
                <Card title="Lucro Líquido" value={`R$ ${dadosFiltrados.lucroLiquido.toFixed(2)}`} color={dadosFiltrados.lucroLiquido >= 0 ? "#4caf50" : "#f44336"} iconClass="fa-chart-line" />
            </div>

            <h2 className="text-xl font-bold mb-4 text-center">Gráfico de Fluxo de Caixa (Mensal)</h2>
            <div style={{ width: "100%", height: 300, backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosFiltrados.dadosGrafico}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="valor" fill="#8884d8" name="Valor Recebido" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function Card({ title, value, color = '#333', iconClass }: { title: string, value: string | number, color?: string, iconClass?: string }) {
    const [isHovered, setIsHovered] = useState(false);

    const textColor = isHovered ? '#1E1E1E' : '#ffffff';
    const iconColor = isHovered ? '#1E1E1E' : '#ffffff';

    return (
        <div
            className="hover:scale-105 transition-all duration-300"
            style={{
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundImage: 'linear-gradient(90deg, #4169E1 0%, #ffffff 100%)',
                backgroundSize: '200% 100%',
                backgroundPosition: isHovered ? '100% 0' : '0 0',
                borderLeft: `5px solid ${color}`,
                width: '100%',
                textAlign: 'center',
                color: textColor,
                cursor: 'pointer',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: textColor, fontWeight: 'bold' }}>{title}</h3>
            {iconClass && (
                <i
                    className={`fa-solid ${iconClass}`}
                    style={{ fontSize: 30, color: iconColor, marginBottom: 8, cursor: 'pointer', marginTop: '10px' }}
                />
            )}
            <p style={{ margin: 0, fontSize: '35px', fontWeight: 'bold', color: textColor }}>{value}</p>
        </div>
    );
}
