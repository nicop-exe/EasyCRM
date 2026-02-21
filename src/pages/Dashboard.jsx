import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import { subscribeToCustomers, isDemo } from '../services/customerService';

const Dashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');

    useEffect(() => {
        const unsubscribe = subscribeToCustomers((data) => {
            setCustomers(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredCustomers = customers.filter(customer => {
        const name = customer.name || '';
        const email = customer.email || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter === 'all' || customer.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    return (
        <div>
            {isDemo && (
                <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    <div>
                        <span className="font-bold">Modo Demo Activo:</span> Los datos no se guardan en Firebase. Configura tus credenciales o reinicia el servidor para conectar.
                    </div>
                </div>
            )}

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

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-xl p-2 flex items-center px-4 backdrop-blur-md">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:col-span-1">
                    <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none backdrop-blur-md [&>option]:bg-black"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="all">Todas las Prioridades</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                </div>
            </div>

            {/* Customer List */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl min-h-[400px]">
                <h3 className="text-xl font-bold text-gray-200 mb-4">Clientes ({filteredCustomers.length})</h3>

                {loading ? (
                    <div className="text-gray-400 text-center py-10 animate-pulse">Cargando clientes...</div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="text-gray-400 text-center py-10">No se encontraron clientes.</div>
                ) : (
                    <div className="grid gap-4">
                        {filteredCustomers.map((customer) => (
                            <div key={customer.id} className="group bg-black/20 hover:bg-white/5 border border-white/5 hover:border-neon-green/30 rounded-2xl p-4 transition-all flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-neon-green transition-colors">{customer.name}</h4>
                                    <p className="text-sm text-gray-400">{customer.email}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${customer.priority === 'Alta' ? 'bg-electric-magenta/20 border-electric-magenta text-electric-magenta' :
                                        customer.priority === 'Media' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
                                            'bg-blue-500/20 border-blue-500 text-blue-500'
                                        }`}>
                                        {customer.priority}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                        {customer.createdAt?.toDate ? customer.createdAt.toDate().toLocaleDateString() : new Date(customer.createdAt || Date.now()).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
