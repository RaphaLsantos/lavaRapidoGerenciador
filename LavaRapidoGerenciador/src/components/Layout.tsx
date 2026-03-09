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
        <div className="flex h-screen bg-gray-50 overflow-hidden font-['Inter']">
            {/* Sidebar - Clean White with Baby Blue Accents */}
            <aside className="w-20 md:w-72 bg-white border-r-2 border-blue-100 text-gray-800 flex flex-col transition-all duration-500 ease-in-out shadow-sm">
                
                {/* Logo Section */}
                <div className="p-8 flex items-center justify-center md:justify-start gap-4 border-b border-blue-50">
                    <div className="relative group">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-2xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-all duration-300">
                            <i className="fa-solid fa-droplet text-white text-2xl"></i>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-2xl font-black tracking-tight text-gray-900">Lava Jato</span>
                        <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase mt-1">Premium</span>
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
                                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-400 shadow-sm" 
                                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
                                    ${isActive ? "bg-blue-400 text-white shadow-md" : "bg-gray-100 group-hover:bg-blue-100"}
                                `}>
                                    <i className={`${item.icon} text-lg`}></i>
                                </div>
                                <span className={`hidden md:block font-semibold tracking-wide ${isActive ? "text-blue-600" : ""}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-6 mt-auto border-t border-blue-50">
                    <div className="hidden md:flex flex-col mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                            <span className="text-xs text-gray-600 uppercase font-bold tracking-widest">Sistema Ativo</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-medium text-gray-700">Plano SaaS</span>
                            <span className="text-xs font-bold px-3 py-1 bg-blue-400 text-white rounded-full">PRO</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => window.location.href = '#sair'}
                        className="w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl text-gray-600 hover:text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-red-200 transition-all duration-300 group font-semibold"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 group-hover:bg-red-100 transition-all duration-300">
                            <i className="fa-solid fa-power-off text-lg"></i>
                        </div>
                        <span className="hidden md:block">Encerrar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto bg-white">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-sm border border-blue-50 p-8 min-h-[calc(100vh-4rem)]">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
