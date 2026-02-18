import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Clientes from "../pages/Clientes";

export default function AppRoutes() {   
    return (
        <BrowserRouter> 
            <Routes>
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/" element={<Navigate to="/clientes" replace />} />
            </Routes>
        </BrowserRouter>
    );
}