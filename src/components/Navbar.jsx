import React from 'react';
import { Home, Bell, User, Search } from 'lucide-react';

const Navbar = ({ onSearch, username, onProfileClick, onHomeClick, currentView, onNotificationsClick, unreadCount }) => {

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 transition-all duration-500">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-[2.5rem] px-8 py-4 border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden group/nav">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                <div className="flex items-center gap-3 group cursor-pointer relative z-10" onClick={onHomeClick}>
                    <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-2xl text-white shadow-2xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <Home size={26} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block tracking-tighter">
                            MiniSocial
                        </h1>
                    </div>
                </div>

                <div className="flex-1 max-w-md mx-12 hidden lg:block relative z-10">
                    <div className="relative group/search">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-indigo-400 transition-colors" size={20} />
                        <input
                            type="text"
                            onChange={(e) => onSearch?.(e.target.value)}
                            placeholder="Find inspiration..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.06] transition-all duration-300 font-medium"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    <button
                        onClick={onNotificationsClick}
                        className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative group/icon"
                    >
                        <Bell size={24} className="group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-transform" />
                        {unreadCount > 0 && (
                            <span className="absolute top-3 right-3 min-w-[18px] h-[18px] bg-indigo-500 rounded-full border-2 border-[#020617] flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <div
                        onClick={onProfileClick}
                        className={`flex items-center gap-3 group/user cursor-pointer p-1 rounded-3xl transition-all ${currentView === 'profile' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        <div className="text-right hidden sm:block pl-3">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] leading-none mb-1">Curator</p>
                            <p className="text-xs font-black text-slate-200">{username || "Guest"}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-[1.25rem] border flex items-center justify-center transition-all duration-500 overflow-hidden shadow-2xl ${currentView === 'profile' ? 'bg-white text-slate-950 border-white' : 'glass border-white/10 text-slate-400 group-hover/user:border-indigo-500/50 group-hover/user:text-white'}`}>
                            {username ? (
                                <span className="font-black text-lg">{username.charAt(0).toUpperCase()}</span>
                            ) : (
                                <User size={24} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );

};

export default Navbar;
