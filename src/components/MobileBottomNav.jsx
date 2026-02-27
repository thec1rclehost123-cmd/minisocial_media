import React from 'react';
import { Home, Bell, User, PlusCircle } from 'lucide-react';

const MobileBottomNav = ({ currentView, onHomeClick, onNotificationsClick, onProfileClick, unreadCount, onPlusClick }) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] px-4 pb-6 pt-2 pointer-events-none">
            <div className="max-w-md mx-auto glass rounded-[2rem] px-6 py-3 border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between pointer-events-auto backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

                <button
                    onClick={onHomeClick}
                    className={`p-3 rounded-2xl transition-all active:scale-95 ${currentView === 'home' ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-500 hover:text-white'}`}
                >
                    <Home size={24} className={currentView === 'home' ? 'fill-indigo-400/20' : ''} />
                </button>

                <button
                    onClick={onNotificationsClick}
                    className="p-3 text-slate-500 hover:text-white transition-all active:scale-95 relative"
                >
                    <Bell size={24} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-950 animate-pulse"></span>
                    )}
                </button>

                <button
                    onClick={onPlusClick}
                    className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20 active:scale-90 transition-all -mt-8 border-4 border-slate-950"
                >
                    <PlusCircle size={28} />
                </button>

                <button
                    className="p-3 text-slate-500 hover:text-white transition-all active:scale-95"
                    onClick={() => {
                        // Scroll to top or search focus? Let's leave for now
                    }}
                >
                    <div className="w-6 h-6 rounded-md border-2 border-slate-700 flex items-center justify-center font-black text-[8px]">?</div>
                </button>

                <button
                    onClick={onProfileClick}
                    className={`p-3 rounded-2xl transition-all active:scale-95 ${currentView === 'profile' ? 'text-purple-400 bg-purple-400/10' : 'text-slate-500 hover:text-white'}`}
                >
                    <User size={24} className={currentView === 'profile' ? 'fill-purple-400/20' : ''} />
                </button>
            </div>
        </div>
    );
};

export default MobileBottomNav;
