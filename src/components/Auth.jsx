import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Github, Chrome, ArrowRight, Loader2 } from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onAuthSuccess();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md animate-reveal">
                <div className="glass rounded-[2.5rem] p-10 border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                    {/* Subtle top light */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-6 shadow-2xl shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
                            {isSignUp ? 'Join the Tribe' : 'Welcome Back'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isSignUp ? 'Begin your creative journey today.' : 'Your sanctuary of inspiration awaits.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-sm font-medium animate-shake text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div className="relative group/input">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-slate-600 outline-none focus:border-indigo-500/30 focus:bg-white/[0.06] transition-all duration-300 font-medium"
                                required
                            />
                        </div>

                        <div className="relative group/input">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                            <input
                                type="password"
                                placeholder="Security Key"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-slate-600 outline-none focus:border-indigo-500/30 focus:bg-white/[0.06] transition-all duration-300 font-medium"
                                required
                            />
                        </div>

                        {!isSignUp && (
                            <div className="text-right">
                                <button type="button" className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors tracking-widest uppercase">
                                    Lost keys?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium w-full py-4 text-lg"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    {isSignUp ? 'Create Account' : 'Authenticate'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-10 flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/[0.05]"></div>
                        <span className="text-slate-600 text-[10px] uppercase tracking-[0.2em] font-black">Social Connect</span>
                        <div className="h-[1px] flex-1 bg-white/[0.05]"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 hover:bg-white/[0.06] hover:text-white hover:border-white/10 transition-all duration-300 font-bold text-sm">
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 hover:bg-white/[0.06] hover:text-white hover:border-white/10 transition-all duration-300 font-bold text-sm">
                            <Chrome className="w-5 h-5" />
                            <span>Google</span>
                        </button>
                    </div>

                    {/* Toggle */}
                    <div className="mt-10 text-center pt-8 border-t border-white/[0.05]">
                        <p className="text-slate-500 font-medium">
                            {isSignUp ? 'Already a member?' : "New to the sanctuary?"}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-2 text-white font-bold hover:text-indigo-400 transition-all underline underline-offset-4"
                            >
                                {isSignUp ? 'Sign In' : 'Join Now'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
