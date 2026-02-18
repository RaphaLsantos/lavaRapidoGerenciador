import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ 
                width: '250px', 
                backgroundColor: '#2c3e50', 
                color: 'white', 
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <h2 style={{ marginBottom: '30px' }}>Lava Jato SaaS</h2>
                <Link to="/dashboard" style={linkStyle}>📊 Dashboard</Link>
                <Link to="/clientes" style={linkStyle}>👥 Clientes</Link>
                <Link to="/servicos-precos" style={linkStyle}>💰 Tabela de Preços</Link>
                <div style={{ marginTop: 'auto', fontSize: '12px', opacity: 0.7 }}>
                    v1.0.0 - Profissional
                </div>
            </aside>
            <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f6fa' }}>
                <Outlet />
            </main>
        </div>
    );
}

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    transition: 'background 0.3s'
};
