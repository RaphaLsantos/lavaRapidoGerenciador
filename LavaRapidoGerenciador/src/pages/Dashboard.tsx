import { useEffect, useState } from "react";
import axios from "axios";

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
        .reduce((acc, number, s: any) => acc + s.valor, 0);


    const totalPendente = servicos
        .filter((s: any) => !s.pago)
        .reduce((acc: number, s: any) => acc + s.valor, 0);

    return (
        <div>
            <h1>Dashboard</h1>

            <p>Total de Clientes: {clientes.length}</p>
            <p>Total de Veículos: {veiculos.length}</p>
            <p>Total de Serviços: {servicos.length}</p>

            <p>Total Faturado: R$ {totalFaturado}</p>
            <p>Total Pendente: R$ {totalPendente}</p>
        </div>
    );

}