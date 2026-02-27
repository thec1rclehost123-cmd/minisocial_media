import React, { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Lock, ShieldCheck, Check, Loader2, AlertCircle, Shield, Key } from 'lucide-react';
import Toast from './Toast';
import { supabase } from '../lib/supabase';

const EditIdentityModal = ({ isOpen, onClose, initialData, onSave, isSaving }) => {
    const [formData, setFormData] = useState({
        username: '',
        currEmail: '',
        newEmail: '',
        currPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [localSaving, setLocalSaving] = useState(false);

    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                username: initialData.username || '',
                currEmail: initialData.email || '',
                newEmail: initialData.email || '',
                currPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setErrors({});
            setLocalSaving(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleMouseMove = (e) => {
        if (!modalRef.current) return;
        const rect = modalRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';

        if (formData.newEmail !== formData.currEmail) {
            if (!formData.newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                newErrors.newEmail = 'Invalid email format';
            }
        }

        if (formData.newPassword || formData.currPassword || formData.confirmPassword) {
            if (!formData.currPassword) newErrors.currPassword = 'Current password required';
            if (formData.newPassword && formData.newPassword.length < 8) {
                newErrors.newPassword = 'Minimum 8 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLocalSaving(true);

        try {
            // Mandatory re-authentication for any change as per secure flow requirement
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.currEmail,
                password: formData.currPassword,
            });

            if (signInError) {
                setToast({ type: 'error', message: 'Current password verification failed' });
                setLocalSaving(false);
                return;
            }

            if (formData.newPassword && formData.newPassword.trim() !== '') {
                const { error: pwdError } = await supabase.auth.updateUser({
                    password: formData.newPassword
                });
                if (pwdError) throw pwdError;
            }

            if (formData.newEmail !== formData.currEmail) {
                const { error: emailError } = await supabase.auth.updateUser({
                    email: formData.newEmail
                });
                if (emailError) throw emailError;
                setToast({ type: 'success', message: 'Verification emails sent to both addresses' });
            }

            const profileSuccess = await onSave({
                username: formData.username,
            });

            if (profileSuccess !== false) {
                if (!toast) setToast({ type: 'success', message: 'Identity reconfigured successfully' });
                setTimeout(onClose, 2000);
            }

        } catch (error) {
            console.error('Update error:', error);
            setToast({ type: 'error', message: error.message || 'Identity update failed' });
        } finally {
            setLocalSaving(false);
        }
    };

    const isButtonDisabled = localSaving || isSaving || !formData.username.trim() ||
        (((formData.newPassword && formData.newPassword.trim() !== '') || formData.newEmail !== formData.currEmail) && !formData.currPassword);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-2xl transition-opacity animate-reveal"
                onClick={onClose}
            ></div>

            <div
                ref={modalRef}
                onMouseMove={handleMouseMove}
                className="relative w-full max-w-xl bg-[#030712]/90 border border-white/10 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(168,85,247,0.15)] animate-modal overflow-hidden transition-transform duration-300 ease-out"
                style={{
                    transform: `perspective(1000px) rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg) scale(1)`,
                }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 pointer-events-none animate-float-parallax"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Edit Identity</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Secure Blockchain-Grade Reconfiguration</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Username */}
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 group-focus-within:text-purple-400 transition-colors">
                                <User size={12} /> Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={`w-full bg-white/[0.03] border rounded-2xl px-6 py-5 focus:outline-none transition-all font-bold placeholder:text-slate-700 ${errors.username ? 'border-rose-500/50' : 'border-white/10 focus:border-purple-500/50'}`}
                                    placeholder="alias_prime"
                                />
                                {errors.username && <p className="text-[9px] text-rose-500 font-bold px-1 mt-1">{errors.username}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 group-focus-within:text-indigo-400 transition-colors">
                                <Mail size={12} /> Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={formData.newEmail}
                                    onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                                    className={`w-full bg-white/[0.03] border rounded-2xl px-6 py-5 focus:outline-none transition-all font-bold placeholder:text-slate-700 ${errors.newEmail ? 'border-rose-500/50' : 'border-white/10 focus:border-indigo-500/50'}`}
                                    placeholder="identity@matrix.io"
                                />
                                {errors.newEmail && <p className="text-[9px] text-rose-500 font-bold px-1 mt-1">{errors.newEmail}</p>}
                                {formData.newEmail !== formData.currEmail && !errors.newEmail && (
                                    <p className="text-[9px] text-indigo-400 font-bold px-1 mt-1 flex items-center gap-1">
                                        <AlertCircle size={10} /> Requires verification after save
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="pt-4 space-y-6">
                            <div className="flex items-center gap-4 mb-2 opacity-50">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                                <Shield size={12} className="text-slate-500" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Vault Access Control</span>
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">
                                    <Key size={11} className="text-amber-500/70" /> Current Password (Required for Email/Password Changes)
                                </label>
                                <input
                                    type="password"
                                    value={formData.currPassword}
                                    onChange={(e) => setFormData({ ...formData, currPassword: e.target.value })}
                                    className={`w-full bg-white/[0.03] border rounded-2xl px-6 py-4 focus:outline-none transition-all font-bold placeholder:text-slate-700 ${errors.currPassword ? 'border-rose-500/50' : 'border-white/10 focus:border-amber-500/50'}`}
                                    placeholder="Validate identity"
                                />
                                {errors.currPassword && <p className="text-[9px] text-rose-500 font-bold px-1">{errors.currPassword}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">
                                        <Lock size={11} /> New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        className={`w-full bg-white/[0.03] border rounded-2xl px-6 py-4 focus:outline-none transition-all font-bold placeholder:text-slate-700 ${errors.newPassword ? 'border-rose-500/50' : 'border-white/10 focus:border-indigo-500/50'}`}
                                        placeholder="Min 8 chars"
                                    />
                                    {errors.newPassword && <p className="text-[9px] text-rose-500 font-bold px-1">{errors.newPassword}</p>}
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">
                                        <ShieldCheck size={11} /> Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={`w-full bg-white/[0.03] border rounded-2xl px-6 py-4 focus:outline-none transition-all font-bold placeholder:text-slate-700 ${errors.confirmPassword ? 'border-rose-500/50' : 'border-white/10 focus:border-indigo-500/50'}`}
                                        placeholder="Re-enter"
                                    />
                                    {errors.confirmPassword && <p className="text-[9px] text-rose-500 font-bold px-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-5 rounded-3xl bg-slate-900/50 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-all active:scale-95"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                disabled={isButtonDisabled}
                                className="flex-[2] relative py-5 rounded-3xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-indigo-500/20 disabled:opacity-30 group/save overflow-hidden active:scale-95"
                            >
                                <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-hover/save:opacity-100 transition-opacity"></div>
                                {localSaving || isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                <span className="relative">Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default EditIdentityModal;
