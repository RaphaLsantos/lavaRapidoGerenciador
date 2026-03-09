import { Link, Outlet, useLocation } from "react-router-dom";
import "../index.css";

export default function Layout() {
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
        { path: "/clientes", icon: "fas fa-user-friends", label: "Clientes" },
        { path: "/servicos-precos", icon: "fas fa-clipboard-list", label: "Serviços" },
    ];

    return (
        <div className="flex h-screen bg-[#0F172A] overflow-hidden font-['Inter']">
            {/* Sidebar - Modern Deep Navy with Glassmorphism */}
            <aside className="w-20 md:w-64 bg-[#1E293B]/50 backdrop-blur-xl border-r border-white/10 text-white flex flex-col transition-all duration-500 ease-in-out">
                
                {/* Logo Section with Neon Glow */}
                <div className="p-8 flex items-center justify-center md:justify-start gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-all duration-300 border border-white/10">
                            <i className="fa-solid fa-droplet text-cyan-400 text-2xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"></i>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase leading-none">Lava Jato</span>
                        <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase mt-1">Premium Manager</span>
                    </div>
                </div>

                {/* Navigation Links - Floating Card Style */}
                <nav className="flex-1 px-4 mt-8 space-y-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    relative flex items-center justify-center md:justify-start gap-4 p-3.5 rounded-2xl transition-all duration-300 group
                                    ${isActive 
                                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,1)]"></div>
                                )}
                                <div className={`
                                    w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
                                    ${isActive ? "bg-cyan-500 text-[#0F172A] shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-slate-800 group-hover:bg-slate-700"}
                                `}>
                                    <i className={`${item.icon} text-lg`}></i>
                                </div>
                                <span className={`hidden md:block font-semibold tracking-wide ${isActive ? "text-cyan-400" : ""}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Profile/SaaS Info */}
                <div className="p-6 mt-auto">
                    <div className="hidden md:flex flex-col mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Sistema Ativo</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-medium text-slate-300">Plano SaaS</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">PRO</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => window.location.href = '#sair'}
                        className="w-full flex items-center justify-center md:justify-start gap-4 p-3.5 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300 group"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 group-hover:bg-red-500/20 transition-all duration-300">
                            <i className="fa-solid fa-power-off text-lg"></i>
                        </div>
                        <span className="hidden md:block font-semibold">Encerrar Sessão</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Modern Dark Canvas */}
            <main className="flex-1 relative overflow-y-auto bg-[#0F172A] p-4 md:p-8">
                {/* Top Glass Header for Main Content */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="bg-[#1E293B]/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-2xl min-h-[calc(100vh-4rem)] p-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
