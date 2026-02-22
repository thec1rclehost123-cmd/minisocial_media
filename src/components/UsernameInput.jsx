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
        <div className="max-w-xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-6 border-white/5 shadow-xl">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                            <User size={24} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Welcome to MiniSocial</h3>
                            <p className="text-sm text-slate-400">Please enter a username to start sharing.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-100 placeholder:text-slate-500 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!username.trim()}
                            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:bg-slate-700 text-white font-semibold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-indigo-500/25 whitespace-nowrap"
                        >
                            Save <Check size={18} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UsernameInput;
