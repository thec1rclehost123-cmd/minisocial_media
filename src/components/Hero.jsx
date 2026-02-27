import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative w-full py-20 mb-10 overflow-visible">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left animate-reveal">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <Sparkles size={14} className="animate-pulse" />
                        The Future of Creative Sync
                    </div>
                    <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-8">
                        Curate your <br />
                        <span className="text-gradient animate-gradient-flow">Creative Space</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed mb-10">
                        Connect with visionaries. Showcase your portfolio. Elevate your artistry in a minimal, high-frequency sanctuary.
                    </p>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <button className="btn-premium flex items-center gap-3 bg-indigo-600/20 px-10 py-4 text-lg">
                            Get Started <ArrowRight size={20} />
                        </button>
                        <button className="px-8 py-4 rounded-2xl text-slate-400 font-bold hover:text-white transition-colors">
                            Explore Community
                        </button>
                    </div>
                </div>

                {/* Visual Content: 3D Card Stack */}
                <div className="flex-1 relative h-[400px] w-full max-w-md hidden lg:block animate-reveal delay-300">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 glass-card-premium rounded-[3rem] p-8 card-stack-3 opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 glass-card-premium rounded-[3rem] p-8 card-stack-2 opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 glass-card-premium rounded-[3rem] p-8 card-stack-1 relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                        <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-6 overflow-hidden">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80')] bg-cover opacity-80 animate-float"></div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/20"></div>
                            <div>
                                <p className="text-sm font-bold text-white leading-none mb-1">AURA Artist</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">3D / Digital Art</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
                            <div className="text-center">
                                <p className="text-lg font-black text-white leading-none">12.4k</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Followers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-white leading-none">1.2k</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Sparks</p>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
