import { Link, Outlet, useLocation } from "react-router-dom";
import "../index.css";

export default function Layout() {
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
        { path: "/clientes", icon: "fas fa-user-friends", label: "Clientes" },
        { path: "/servicos-precos", icon: "fas fa-clipboard-list", label: "Serviços" },
        { path: "/agendamentos", icon: "fas fa-calendar-check", label: "Agendamentos" },
        { path: "/despesas", icon: "fas fa-money-bill-wave", label: "Despesas" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-['Inter']">
            {/* Sidebar - Baby Blue Background */}
            <aside className="w-20 md:w-72 bg-gradient-to-b from-blue-200 to-blue-300 border-r-2 border-blue-400 text-white flex flex-col transition-all duration-500 ease-in-out shadow-lg">
                
                {/* Logo Section */}
                <div className="p-8 flex items-center justify-center md:justify-start gap-4 border-b-2 border-blue-400/30">
                    <div className="relative group">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                            <i className="fa-solid fa-droplet text-blue-400 text-2xl"></i>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-2xl font-black tracking-tight text-white drop-shadow-sm">Lava Jato</span>
                        <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase mt-1 drop-shadow-sm">Premium</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 mt-8 space-y-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    relative flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl transition-all duration-300 group
                                    ${isActive 
                                        ? "bg-white text-blue-600 shadow-lg scale-105" 
                                        : "text-white hover:bg-white/20 hover:text-white"
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
                                    ${isActive ? "bg-blue-400 text-white shadow-md" : "bg-white/20 group-hover:bg-white/30"}
                                `}>
                                    <i className={`${item.icon} text-lg`}></i>
                                </div>
                                <span className={`hidden md:block font-semibold tracking-wide`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-6 mt-auto border-t-2 border-blue-400/30">
                    <div className="hidden md:flex flex-col mb-6 p-4 bg-white/20 rounded-2xl border-2 border-white/30 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            <span className="text-xs text-white uppercase font-bold tracking-widest drop-shadow-sm">Sistema Ativo</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-medium text-white drop-shadow-sm">Plano SaaS</span>
                            <span className="text-xs font-bold px-3 py-1 bg-white text-blue-400 rounded-full shadow-md">PRO</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => window.location.href = '#sair'}
                        className="w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl text-white hover:bg-red-400/30 hover:text-white border-2 border-transparent hover:border-white/50 transition-all duration-300 group font-semibold"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 group-hover:bg-red-400/50 transition-all duration-300">
                            <i className="fa-solid fa-power-off text-lg"></i>
                        </div>
                        <span className="hidden md:block">Encerrar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto bg-white">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-8 min-h-[calc(100vh-4rem)]">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
