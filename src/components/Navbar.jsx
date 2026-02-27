import React from 'react';
import { Home, Bell, User, Search } from 'lucide-react';

const Navbar = ({ onSearch, username, onProfileClick, onHomeClick, currentView, onNotificationsClick, unreadCount }) => {

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-3 py-4 sm:px-6 sm:py-8 transition-all duration-500">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-[1.5rem] sm:rounded-[2.5rem] px-4 py-2 sm:px-8 sm:py-4 border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden group/nav transition-all">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer relative z-10 shrink-0" onClick={onHomeClick}>
                    <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-white shadow-2xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <Home size={20} className="sm:w-[26px] sm:h-[26px]" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden xs:block tracking-tighter">
                            MiniSocial
                        </h1>
                    </div>
                </div>

                <div className="flex-1 max-w-md mx-4 lg:mx-12 hidden lg:block relative z-10">
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

                <div className="flex items-center gap-2 relative z-10 lg:gap-6">
                    <button
                        onClick={onNotificationsClick}
                        className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl sm:rounded-2xl transition-all relative group/icon hidden sm:flex"
                    >
                        <Bell size={20} className="sm:w-[24px] sm:h-[24px] group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-transform" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 min-w-[14px] h-[14px] sm:min-w-[18px] sm:h-[18px] bg-indigo-500 rounded-full border border-[#020617] flex items-center justify-center text-[8px] sm:text-[10px] font-black text-white shadow-[0_0_100px_rgba(99,102,241,0.8)] animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <div
                        onClick={onProfileClick}
                        className={`flex items-center gap-2 sm:gap-3 group/user cursor-pointer p-1 rounded-2xl sm:rounded-3xl transition-all ${currentView === 'profile' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        <div className="text-right hidden md:block pl-3">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] leading-none mb-1">Curator</p>
                            <p className="text-xs font-black text-slate-200">{username || "Guest"}</p>
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-[1.25rem] border flex items-center justify-center transition-all duration-500 overflow-hidden shadow-2xl ${currentView === 'profile' ? 'bg-white text-slate-950 border-white' : 'glass border-white/10 text-slate-400 group-hover/user:border-indigo-500/50 group-hover/user:text-white'}`}>
                            {username ? (
                                <span className="font-black text-sm sm:text-lg">{username.charAt(0).toUpperCase()}</span>
                            ) : (
                                <User size={20} className="sm:w-[24px] sm:h-[24px]" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );

};

export default Navbar;
