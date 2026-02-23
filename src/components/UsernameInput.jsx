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
        <div className="max-w-xl mx-auto mb-16 animate-reveal">
            <form onSubmit={handleSubmit} className="glass rounded-[2.5rem] p-8 border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-white/10 shadow-inner group-focus-within:scale-110 transition-transform duration-500">
                            <User size={28} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight text-white mb-1 leading-tight">Identity First</h3>
                            <p className="text-sm text-slate-500 font-medium">How should the community recognize you?</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Type your alias..."
                            className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500/30 focus:bg-white/[0.06] text-slate-100 placeholder:text-slate-600 transition-all font-semibold text-lg"
                        />
                        <button
                            type="submit"
                            disabled={!username.trim()}
                            className="btn-primary flex items-center gap-2 h-full"
                        >
                            Confirm <Check size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </form>
        </div>

    );
};

export default UsernameInput;
