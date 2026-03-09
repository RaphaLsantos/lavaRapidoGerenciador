import { Link, Outlet, useLocation } from "react-router-dom";
import "../index.css";

export default function Layout() {
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard" },
        { path: "/clientes", icon: "fas fa-users", label: "Clientes" },
        { path: "/servicos-precos", icon: "fas fa-tags", label: "Serviços" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-24 md:w-64 bg-indigo-700 text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl">
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-center md:justify-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                        <i className="fa-solid fa-car-wash text-indigo-700 text-xl"></i>
                    </div>
                    <span className="hidden md:block text-xl font-extrabold tracking-wider uppercase italic">Lava Jato</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 mt-6 space-y-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center justify-center md:justify-start gap-4 p-3 rounded-2xl transition-all duration-300 group
                                    ${isActive 
                                        ? "bg-white text-indigo-700 shadow-lg scale-105" 
                                        : "text-indigo-100 hover:bg-indigo-600 hover:text-white hover:translate-x-1"
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-300
                                    ${isActive ? "bg-indigo-50" : "bg-indigo-800 group-hover:bg-indigo-500"}
                                `}>
                                    <i className={`${item.icon} text-lg`}></i>
                                </div>
                                <span className="hidden md:block font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-6 mt-auto border-t border-indigo-600/50">
                    <div className="hidden md:flex flex-col mb-6 p-3 bg-indigo-800/50 rounded-xl text-center">
                        <span className="text-xs text-indigo-200 uppercase tracking-widest font-bold">Plano SaaS</span>
                        <span className="text-sm font-semibold text-white">Versão 1.0.0</span>
                    </div>
                    
                    <button 
                        onClick={() => window.location.href = '#sair'}
                        className="w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-2xl text-indigo-100 hover:bg-red-500 hover:text-white transition-all duration-300 group"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-800 group-hover:bg-red-400 transition-colors">
                            <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
                        </div>
                        <span className="hidden md:block font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto focus:outline-none bg-white md:rounded-l-[40px] shadow-inner">
                <div className="py-6 px-4 sm:px-6 md:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
