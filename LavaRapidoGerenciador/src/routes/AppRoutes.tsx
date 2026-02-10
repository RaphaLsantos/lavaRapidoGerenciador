import { BrowserRouter, Routes, Route } from "react-router-dom";
import Clientes from "../pages/Clientes";

export default function AppRoutes() {   
    return (
        <BrowserRouter> 
            <Routes>
                <Route path="/clientes" element={<Clientes />} />
            </Routes>
        </BrowserRouter>
    );
}