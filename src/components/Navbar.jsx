import React from 'react';
import { Layout, Bell, User, Search } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-3xl px-6 py-3 border-white/5">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                        <Layout size={24} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
                        MiniSocial
                    </h1>
                </div>

                <div className="flex-1 max-w-md mx-8 hidden md:block">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search inspiration..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative">
                        <Bell size={22} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
                    </button>
                    <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all">
                        <User size={22} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
