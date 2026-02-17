import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold font-satoshi text-white">Dashboard</h2>
                <Link
                    to="/customers/new"
                    className="flex items-center gap-2 bg-neon-green text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                >
                    <Plus size={20} />
                    <span>Cargar Cliente</span>
                </Link>
            </div>

            {/* Bento Grid Logic - Placeholder for now */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 row-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                    <h3 className="text-xl font-bold text-gray-200 mb-4">Actividad Reciente</h3>
                    <p className="text-gray-400">No hay actividad reciente.</p>
                </div>

                <div className="bg-electric-magenta/10 border border-electric-magenta/20 rounded-3xl p-6 backdrop-blur-xl">
                    <h3 className="text-xl font-bold text-electric-magenta mb-2">Alertas</h3>
                    <div className="text-4xl font-bold text-white">0</div>
                </div>

                <div className="bg-neon-green/10 border border-neon-green/20 rounded-3xl p-6 backdrop-blur-xl">
                    <h3 className="text-xl font-bold text-neon-green mb-2">Clientes Activos</h3>
                    <div className="text-4xl font-bold text-white">0</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
