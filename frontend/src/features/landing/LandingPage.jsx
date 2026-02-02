import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Recycle, MapPin, BarChart3, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/PublicNavbar';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:w-1/2 text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-800 text-sm font-medium mb-6 border border-emerald-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Live in Ward 4, Guwahati
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 text-slate-900">
                                Smarter Waste <br />
                                <span className="gradient-text">Management</span> for <br />
                                Cleaner Cities.
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Join the revolution in urban cleanliness. Schedule pickups, track your impact, and earn rewards for segregating waste correctly. Designed for citizens and collectors.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/signup" className="btn-primary w-full sm:w-auto h-12 px-8 text-base">
                                    Get Started
                                </Link>
                                <a href="#how-it-works" className="btn-outline w-full sm:w-auto h-12 px-8 text-base border-gray-300 text-slate-700 hover:bg-gray-50 hover:text-slate-900 hover:border-gray-400">
                                    How it Works
                                </a>
                            </div>
                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-slate-500 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Verified Collectors</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Instant Rewards</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 bg-white rounded-3xl shadow-glass p-4 border border-white/40">
                                <img
                                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Waste Management Dashboard"
                                    className="rounded-2xl w-full h-auto object-cover shadow-sm"
                                />

                                {/* Floating Cards */}
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-soft flex items-center gap-3 animate-slide-up">
                                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                        <Recycle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Waste Recycled</p>
                                        <p className="text-xl font-bold text-slate-900">1,240 kg</p>
                                    </div>
                                </div>

                                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-soft flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <div className="bg-lime-100 p-3 rounded-full text-lime-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Ward</p>
                                        <p className="text-xl font-bold text-slate-900">Ward 04</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-200/30 to-lime-200/30 blur-3xl rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
                            Everything you need to <br /> manage waste efficiently
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Smart tools for households and collectors to streamline the entire waste collection lifecycle.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Recycle className="w-8 h-8 text-emerald-600" />,
                                title: "Source Segregation",
                                desc: "Easy-to-use interface for categorizing waste into Wet, Dry, and E-Waste at the source."
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8 text-lime-600" />,
                                title: "Smart Scheduling",
                                desc: "Schedule pickups at your convenience. Real-time tracking of collector arrival."
                            },
                            {
                                icon: <ArrowRight className="w-8 h-8 text-teal-600" />,
                                title: "Incentive System",
                                desc: "Earn points for every correct segregation. Redeem points for community rewards."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-soft transition-all duration-300 border border-transparent hover:border-gray-100 group">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                        Ready to clean up your ward?
                    </h2>
                    <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
                        Join hundreds of households in Ward 4 contributing to a cleaner, greener Guwahati.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup" className="btn-secondary h-14 px-8 text-lg min-w-[180px]">
                            Join Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-500">
                            <Leaf size={18} />
                        </div>
                        <span className="text-lg font-heading font-bold text-white">WardWise</span>
                    </div>
                    <p className="text-sm">© 2024 WardWise - Guwahati Hackathon Track 4 Prototype.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
