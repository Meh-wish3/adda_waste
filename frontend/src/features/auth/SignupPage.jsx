import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState('citizen'); // citizen | collector
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ward: 'Ward 4',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate delay
        setTimeout(() => {
            setLoading(false);
            navigate('/app');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-secondary/20 to-lime-100/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/40 to-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                            <Leaf size={24} />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500">Join the community for a cleaner Ward 4.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-glass p-8 border border-white/50">
                    {/* User Type Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8 relative">
                        <div className={`absolute inset-y-1 w-1/2 bg-white shadow-sm rounded-lg transition-all duration-300 ${userType === 'collector' ? 'left-1/2 translate-x-0' : 'left-0'}`} />
                        <button
                            onClick={() => setUserType('citizen')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors ${userType === 'citizen' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Citizen
                        </button>
                        <button
                            onClick={() => setUserType('collector')}
                            className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors ${userType === 'collector' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Collector
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="input-field pl-10"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Ward Number</label>
                                <div className="relative">
                                    <select
                                        className="input-field pl-10 appearance-none"
                                        value={formData.ward}
                                        onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                        disabled
                                    >
                                        <option>Ward 4</option>
                                    </select>
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="input-field pl-10"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="input-field pl-10"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full h-12 text-base justify-center group"
                            >
                                {loading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-emerald-700">
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
