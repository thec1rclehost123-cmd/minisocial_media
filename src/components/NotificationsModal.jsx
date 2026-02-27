import React, { useEffect, useState } from 'react';
import { X, Bell, UserPlus, Heart, MessageSquare, Loader2 } from 'lucide-react';
import { toggleFollow } from '../lib/supabaseAPI';

// Simple native implementation of "time ago" to avoid extra dependencies
const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) return 'just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return new Date(date).toLocaleDateString();
};

const NotificationsModal = ({ isOpen, onClose, notifications, onMarkAsRead, currentUserId, onFollowUpdate }) => {
    const [localNotifications, setLocalNotifications] = useState(notifications);

    useEffect(() => {
        setLocalNotifications(notifications);
        if (isOpen && notifications.some(n => !n.is_read)) {
            onMarkAsRead();
        }
    }, [notifications, isOpen, onMarkAsRead]);

    const handleFollowBack = async (actorId) => {
        try {
            await toggleFollow(currentUserId, actorId);
            onFollowUpdate(actorId, true);
        } catch (error) {
            console.error('Error following back:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-[#0a0c10]/80 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl animate-modal-in overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>

                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                            <Bell size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Updates</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Centralized Intelligence</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {localNotifications.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="inline-flex p-4 bg-white/5 rounded-full mb-4">
                                <Bell size={24} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500 font-bold text-sm tracking-tight">No transmissions received yet.</p>
                        </div>
                    ) : (
                        localNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`relative group p-5 rounded-3xl border transition-all ${notification.is_read ? 'bg-white/[0.02] border-white/5' : 'bg-white/[0.05] border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
                                    } hover:border-white/20`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <img
                                            src={notification.actor?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.actor?.username}`}
                                            alt={notification.actor?.username}
                                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/5"
                                        />
                                        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-slate-900 border border-white/10">
                                            {notification.type === 'like' && <Heart size={10} className="text-rose-500 fill-rose-500" />}
                                            {notification.type === 'comment' && <MessageSquare size={10} className="text-blue-400" />}
                                            {notification.type === 'follow' && <UserPlus size={10} className="text-purple-400" />}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-black text-white text-sm tracking-tight truncate">
                                                {notification.actor?.username}
                                            </span>
                                            {!notification.is_read && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-xs font-bold leading-relaxed mb-2">
                                            {notification.type === 'like' && 'reconfigured appreciation for your transmission.'}
                                            {notification.type === 'comment' && 'encoded a response to your data entry.'}
                                            {notification.type === 'follow' && 'established a neural connection with your profile.'}
                                        </p>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                                            {formatTimeAgo(notification.created_at)}
                                        </span>
                                    </div>

                                    {notification.type === 'follow' && (
                                        <button
                                            onClick={() => handleFollowBack(notification.actor?.id)}
                                            className="px-4 py-2 bg-purple-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            Follow Back
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsModal;
