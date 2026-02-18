import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Clientes from "../pages/Clientes";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {   
    return (
        <BrowserRouter> 
            <Routes>
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/clientes" replace />} />
            </Routes>
        </BrowserRouter>
    );
}