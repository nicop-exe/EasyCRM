import React from 'react';
import { LayoutDashboard, Users, FileText, Settings, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const NavItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
            active
                ? "bg-neon-green/10 text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)] border border-neon-green/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}
    >
        <Icon size={20} className={clsx("transition-transform duration-300 group-hover:scale-110", active && "animate-pulse")} />
        <span className="font-medium">{label}</span>
    </Link>
);

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-[#050505] text-white font-inter selection:bg-neon-green/30 selection:text-neon-green">
            {/* Sidebar */}
            <aside className="w-64 fixed h-full z-20 hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold font-satoshi bg-gradient-to-r from-neon-green to-emerald-400 bg-clip-text text-transparent">
                        Easy<span className="text-white">CRM</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === '/'} />
                    <NavItem icon={Users} label="Clientes" to="/customers" active={location.pathname.startsWith('/customers')} />
                    <NavItem icon={FileText} label="Documentos" to="/documents" active={location.pathname.startsWith('/documents')} />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <NavItem icon={Settings} label="Configuración" to="/settings" active={location.pathname === '/settings'} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative">
                {/* Top decoration */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-green/50 to-transparent opacity-50"></div>

                <div className="p-8 min-h-screen">
                    {children}
                </div>
            </main>

            {/* Mobile Navigation (Bottom) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around p-4 safe-area-bottom">
                <Link to="/" className="text-neon-green"><LayoutDashboard /></Link>
                <Link to="/customers" className="text-gray-400"><Users /></Link>
                <Link to="/documents" className="text-gray-400"><FileText /></Link>
            </div>
        </div>
    );
};

export default Layout;
