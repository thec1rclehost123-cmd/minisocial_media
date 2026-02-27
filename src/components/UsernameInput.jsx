import React, { useState } from 'react';
import { User, Check } from 'lucide-react';

const UsernameInput = ({ onSave }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onSave(username.trim());
        }
    };

    return (
        <div className="max-w-xl mx-auto mb-10 sm:mb-16 animate-reveal px-2 sm:px-0">
            <form onSubmit={handleSubmit} className="glass-card-premium rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-white/10 shadow-inner group-focus-within:scale-110 transition-transform duration-500">
                            <User size={20} className="text-indigo-400 sm:w-[28px] sm:h-[28px]" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-0.5 sm:mb-1 leading-tight">Identity First</h3>
                            <p className="text-[10px] sm:text-sm text-slate-500 font-medium">How should the community recognize you?</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Type your alias..."
                            className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.06] text-slate-100 placeholder:text-slate-600 transition-all font-semibold text-base sm:text-lg"
                        />
                        <button
                            type="submit"
                            disabled={!username.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl sm:rounded-2xl px-6 py-3 sm:py-4 font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                        >
                            Confirm <Check size={18} className="sm:w-[20px] sm:h-[20px]" />
                        </button>
                    </div>
                </div>
            </form>
        </div>

    );
};

export default UsernameInput;
