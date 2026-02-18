import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Clientes from "../pages/Clientes";
import Dashboard from "../pages/Dashboard";
import TabelaPrecos from "../pages/TabelaPrecos";

export default function AppRoutes() {   
    return (
        <BrowserRouter> 
            <Routes>
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/servicos-precos" element={<TabelaPrecos />} />
                <Route path="/" element={<Navigate to="/clientes" replace />} />
            </Routes>
        </BrowserRouter>
    );
}