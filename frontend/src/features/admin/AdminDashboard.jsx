import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, TrendingUp, Users, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [overview, setOverview] = useState(null);
    const [wasteStats, setWasteStats] = useState([]);
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [overviewRes, wasteRes, perfRes] = await Promise.all([
                axios.get(`${API_URL}/admin/overview`),
                axios.get(`${API_URL}/admin/waste-stats`),
                axios.get(`${API_URL}/admin/collector-performance`),
            ]);

            setOverview(overviewRes.data);
            setWasteStats(wasteRes.data);
            setPerformance(perfRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-primary">Municipal Admin Dashboard</h1>
                            <p className="text-sm text-slate-500 mt-1">Ward 4 - Waste Management Overview</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                                <p className="text-xs text-slate-500">{user?.role}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <BarChart3 size={24} className="text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Pickups Today</p>
                        <p className="text-3xl font-bold text-slate-900">{overview?.totalPickupsToday || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                <TrendingUp size={24} className="text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-emerald-600">{overview?.completedPickups || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <Trash2 size={24} className="text-amber-600" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Pending</p>
                        <p className="text-3xl font-bold text-amber-600">{overview?.pendingPickups || 0}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Users size={24} className="text-purple-600" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Points Distributed</p>
                        <p className="text-3xl font-bold text-purple-600">{overview?.totalPointsDistributed || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Waste Type Breakdown */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Waste Type Breakdown</h2>
                        <div className="space-y-4">
                            {wasteStats.map((stat) => {
                                const total = wasteStats.reduce((sum, s) => sum + s.count, 0);
                                const percentage = total > 0 ? ((stat.count / total) * 100).toFixed(1) : 0;

                                const colors = {
                                    wet: 'bg-emerald-500',
                                    dry: 'bg-blue-500',
                                    'e-waste': 'bg-amber-500',
                                };

                                return (
                                    <div key={stat.wasteType}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-700 capitalize">{stat.wasteType}</span>
                                            <span className="text-sm text-slate-500">{stat.count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${colors[stat.wasteType] || 'bg-gray-500'}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {wasteStats.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">No data available</p>
                            )}
                        </div>
                    </div>

                    {/* Collector Performance */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Collection Performance</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-slate-700">Total Completed</span>
                                <span className="text-lg font-bold text-primary">{performance?.totalCompleted || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                                <span className="text-sm font-medium text-slate-700">Verified Segregation</span>
                                <span className="text-lg font-bold text-emerald-600">{performance?.verified || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                                <span className="text-sm font-medium text-slate-700">Not Verified</span>
                                <span className="text-lg font-bold text-amber-600">{performance?.notVerified || 0}</span>
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-xs font-semibold text-blue-900 mb-1">Verification Rate</p>
                                <p className="text-2xl font-bold text-blue-600">{performance?.verificationRate || 0}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
