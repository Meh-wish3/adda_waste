import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, Truck } from 'lucide-react';

const AppNavbar = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Determine where to go based on user type if we had one, 
        // for now just go to landing
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/app" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary">
                        <Leaf size={18} />
                    </div>
                    <span className="text-lg font-heading font-bold text-primary hidden sm:inline">
                        Ward<span className="text-emerald-600">Wise</span>
                    </span>
                </Link>

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => onTabChange('citizen')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'citizen'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <User size={16} />
                        Citizen
                    </button>
                    <button
                        onClick={() => onTabChange('collector')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'collector'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Truck size={16} />
                        Collector
                    </button>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Log out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default AppNavbar;
