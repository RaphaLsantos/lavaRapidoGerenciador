import { useEffect, useState } from "react";
import axios from "axios";
import{
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

export default function Dashboard() {
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        async function carregarDados() {
            const c = await axios.get("http://localhost:3000/clientes");
            const v = await axios.get("http://localhost:3000/veiculos");
            const s = await axios.get("http://localhost:3000/servicos");

            setClientes(c.data);
            setVeiculos(v.data);
            setServicos(s.data);
        }

        carregarDados();
    }, []);

    const totalFaturado = servicos
        .filter((s: any) => s.pago)
        .reduce((acc: number, s: any) => acc + s.valor, 0);


    const totalPendente = servicos
        .filter((s: any) => !s.pago)
        .reduce((acc: number, s: any) => acc + s.valor, 0);


    const dadosGrafico = servicos.reduce((acc: any[], servico: any) => {
        const existente = acc.find((item) => item.nome === servico.nome);
        if (existente) {
            existente.valor += servico.valor;
        } else {
            acc.push({ nome: servico.nome, valor: servico.valor });
        }
        return acc;
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>

            <p>Total de Clientes: {clientes.length}</p>
            <p>Total de Veículos: {veiculos.length}</p>
            <p>Total de Serviços: {servicos.length}</p>

            <p>Total Faturado: R$ {totalFaturado}</p>
            <p>Total Pendente: R$ {totalPendente}</p>

            <h2>Faturamento por serviço</h2>
            <div style={{width: "100%", height: 300}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosGrafico}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="valor" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

}