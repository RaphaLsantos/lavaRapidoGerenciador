import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Clientes from "../pages/Clientes";
import Dashboard from "../pages/Dashboard";
import TabelaPrecos from "../pages/TabelaPrecos";
import Layout from "../components/Layout";

export default function AppRoutes() {   
    return (
        <BrowserRouter> 
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/servicos-precos" element={<TabelaPrecos />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
                {/* Rota de fallback para evitar o erro de "No routes matched" */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
