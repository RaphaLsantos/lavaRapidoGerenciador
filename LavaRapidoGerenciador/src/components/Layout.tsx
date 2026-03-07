import { Link, Outlet } from "react-router-dom";
import "../index.css";

export default function Layout() {
    return (
        <div style={{ display: 'flex', height: '100vh', }}>
            <aside style={{
                width: '100px',
                backgroundColor: '#4169E1',
                color: 'white',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
                height: '100vh',
                borderRadius: '30px',
                margin: '20px'
            }}>
                <h2 className="text-3xl font-bold text-white mb-6 tracking-tight cursor-pointer text-center hover:scale-120 transition-transform duration-200"><i className="fa-solid fa-bars text-white-500 "></i></h2>
                <Link to="/dashboard" className={`${linkClasses} group`}><i className="fas fa-tachometer-alt group-hover:text-white"></i></Link>
                <Link to="/clientes" className={`${linkClasses} group`}><i className="fas fa-users group-hover:text-white"></i></Link>
                <Link to="/servicos-precos" className={`${linkClasses} group`}><i className="fas fa-tags group-hover:text-white"></i></Link>

                <div style={{fontSize: '12px', opacity: 0.7, textAlign: 'center', padding: '10px', color: '#ffffff', fontWeight: 'bold', marginTop: 'auto' }}>
                    v1.0.0<br></br>SaaS
                </div>
                <div className="text-center text-sm text-gray-300">
                    <a href="#sair"><i className="fa-solid fa-arrow-right-from-bracket text-3xl text-white hover:scale-120 text-xl transition-transform duration-200"></i></a>
                </div>
            </aside>
            <main style={{ flex: 1, padding: '20px', backgroundColor: '#ffffff' }}>
                <Outlet />
            </main>
        </div>
    );
}

// base styles for sidebar links; hover handled by Tailwind classes
const linkClasses =
    "text-[white] p-2 rounded bg-white/10 text-center text-xl " +
    "transition-colors duration-300 hover:bg-white/20 hover:scale-110 hover:text-white transition-transform duration-200";


