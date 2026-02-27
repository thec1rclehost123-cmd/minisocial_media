import React, { useEffect, useState } from 'react';
import { X, Bell, UserPlus, Heart, MessageSquare, Loader2 } from 'lucide-react';

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

const NotificationsModal = ({ isOpen, onClose, notifications, onMarkAsRead, currentUserId, onFollow, followingIds = [], followLoadingIds = new Set() }) => {
    const [localNotifications, setLocalNotifications] = useState(notifications);

    useEffect(() => {
        setLocalNotifications(notifications);
        if (isOpen && notifications.some(n => !n.is_read)) {
            onMarkAsRead();
        }
    }, [notifications, isOpen, onMarkAsRead]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-[#0a0c10]/80 border border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl backdrop-blur-xl animate-modal-in overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>

                <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-purple-500/10 rounded-xl sm:rounded-2xl border border-purple-500/20">
                            <Bell size={18} className="text-purple-400 sm:w-[20px] sm:h-[20px]" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Updates</h2>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500 italic">Centralized Intelligence</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 sm:p-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                    >
                        <X size={18} className="sm:w-[20px] sm:h-[20px]" />
                    </button>
                </div>

                <div className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {localNotifications.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="inline-flex p-4 bg-white/5 rounded-full mb-4">
                                <Bell size={24} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500 font-bold text-sm tracking-tight">No transmissions received yet.</p>
                        </div>
                    ) : (
                        localNotifications.map((notification) => {
                            const actorId = notification.actor?.id;
                            const isFollowing = actorId ? followingIds.includes(actorId) : false;
                            const isLoading = actorId ? followLoadingIds.has(actorId) : false;

                            return (
                                <div
                                    key={notification.id}
                                    className={`relative group p-3 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all ${notification.is_read ? 'bg-white/[0.02] border-white/5' : 'bg-white/[0.05] border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
                                        } hover:border-white/20`}
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="relative shrink-0">
                                            <img
                                                src={notification.actor?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.actor?.username}`}
                                                alt={notification.actor?.username}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover ring-2 ring-white/5"
                                            />
                                            <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-slate-900 border border-white/10">
                                                {notification.type === 'like' && <Heart size={8} className="text-rose-500 fill-rose-500 sm:w-[10px] sm:h-[10px]" />}
                                                {notification.type === 'comment' && <MessageSquare size={8} className="text-blue-400 sm:w-[10px] sm:h-[10px]" />}
                                                {notification.type === 'follow' && <UserPlus size={8} className="text-purple-400 sm:w-[10px] sm:h-[10px]" />}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                                <span className="font-black text-white text-xs sm:text-sm tracking-tight truncate">
                                                    {notification.actor?.username}
                                                </span>
                                                {!notification.is_read && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-[10px] sm:text-xs font-bold leading-relaxed mb-1.5 sm:mb-2">
                                                {notification.type === 'like' && 'reconfigured appreciation for your transmission.'}
                                                {notification.type === 'comment' && 'encoded a response to your data entry.'}
                                                {notification.type === 'follow' && 'established a neural connection with your profile.'}
                                            </p>
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-600">
                                                {formatTimeAgo(notification.created_at)}
                                            </span>
                                        </div>

                                        {notification.type === 'follow' && actorId && (
                                            <button
                                                onClick={() => onFollow(actorId)}
                                                disabled={isLoading}
                                                className={`px-3 py-1.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 shrink-0 ${isFollowing
                                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'
                                                    : 'bg-purple-500 text-white hover:bg-purple-400'
                                                    } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            >
                                                {isLoading ? (
                                                    <Loader2 size={12} className="animate-spin" />
                                                ) : isFollowing ? (
                                                    'Following'
                                                ) : (
                                                    'Follow'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsModal;
