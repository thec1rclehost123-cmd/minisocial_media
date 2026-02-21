import React, { useState } from 'react'
import { Plus, Heart, Trash2, MessageSquare } from 'lucide-react'

function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        MiniSocial
                    </h1>
                    <button className="p-2 rounded-full glass hover:bg-white/10 transition-colors">
                        <Plus size={24} />
                    </button>
                </header>

                {/* Feature Sections (Placeholders for Team) */}
                <div className="grid gap-6">
                    <section className="p-6 rounded-2xl glass space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-300">
                            <Plus size={20} /> Create Post
                        </h2>
                        <p className="text-slate-400 text-sm">Waiting for developer assignment...</p>
                    </section>

                    <section className="p-6 rounded-2xl glass space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-violet-300">
                            <MessageSquare size={20} /> Feed View
                        </h2>
                        <p className="text-slate-400 text-sm">Waiting for developer assignment...</p>

                        {/* Example Card */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                            <p>Welcome to the collaborative project! Clone, branch, and start building.</p>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors">
                                    <Heart size={18} /> <span className="text-xs">0</span>
                                </button>
                                <button className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors">
                                    <Trash2 size={18} /> <span className="text-xs">Delete</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="pt-10 text-center text-slate-500 text-xs">
                    Built with React + Vite + Tailwind 4
                </footer>
            </div>
        </div>
    )
}

export default App
