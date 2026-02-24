import React, { useState } from 'react';
import { Settings, Grid, Heart, MessageSquare, Bookmark, ShieldCheck, MapPin, Link as LinkIcon } from 'lucide-react';
import Feed from './Feed';
import ProfileCard from './ProfileCard';

const ProfileView = ({ posts, username, stats, onLike, onDelete, onAddComment, onDeleteComment, onLikeComment }) => {
    const [activeTab, setActiveTab] = useState('sparks');

    // Filter posts for this user
    const userPosts = posts.filter(post => post.username === username);

    const tabs = [
        { id: 'sparks', label: 'Sparks', icon: <Grid size={18} />, count: userPosts.length },
        { id: 'saved', label: 'Saved', icon: <Bookmark size={18} />, count: 0 },
        { id: 'inspired', label: 'Inspired', icon: <Heart size={18} />, count: 0 }
    ];

    return (
        <div className="max-w-6xl mx-auto animate-reveal">
            {/* Profile Header Header */}
            <div className="relative mb-20">
                {/* Visual Cover (Abstract Gradient) */}
                <div className="h-64 rounded-[3rem] bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/40 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full"></div>
                </div>

                {/* Profile Card Overlay */}
                <div className="px-12 -mt-32 relative z-10 flex flex-col lg:flex-row items-end gap-12">
                    <div className="w-48 h-48 rounded-[3.5rem] bg-gradient-to-tr from-indigo-500 to-purple-600 p-1.5 shadow-2xl">
                        <div className="w-full h-full rounded-[3.2rem] bg-slate-950 flex items-center justify-center relative overflow-hidden">
                            <span className="text-6xl font-black text-white">{username?.charAt(0).toUpperCase() || 'A'}</span>
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent"></div>
                        </div>
                    </div>

                    <div className="flex-1 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                            <h2 className="text-5xl font-black text-white tracking-tighter">{username || 'Visionary'}</h2>
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95">
                                    Edit Profile
                                </button>
                                <button className="p-2.5 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all">
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-8 text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-bold tracking-tight">Active Portfolio</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-indigo-400" />
                                <span className="text-sm font-bold tracking-tight">Global Workspace</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LinkIcon size={16} className="text-purple-400" />
                                <span className="text-sm font-bold tracking-tight hover:text-white cursor-pointer transition-colors">visionary.design</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Profile Grid View */}
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Sidebar: Stats & Info */}
                <aside className="lg:w-80 shrink-0 flex flex-col gap-10">
                    <div className="glass-card-premium rounded-[2.5rem] p-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Vital Statistics</h4>
                        <div className="space-y-8">
                            <div>
                                <p className="text-3xl font-black text-white mb-1">{stats?.posts || '0'}</p>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Creative Sparks</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white mb-1">{stats?.followers || '0'}</p>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Followers</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white mb-1">{stats?.following || '0'}</p>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Following</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card-premium rounded-[2.5rem] p-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">About Visionary</h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            Architect of digital experiences. Exploring the intersection of physics, aesthetics, and code. Focused on high-fidelity social sanctuaries.
                        </p>
                    </div>
                </aside>

                {/* Content Area: Tabs & Grid */}
                <div className="flex-1 min-w-0">
                    {/* Tabs Navigation */}
                    <div className="flex items-center justify-center gap-10 mb-12 border-b border-white/5 pb-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 pb-6 -mb-[26px] transition-all relative ${activeTab === tab.id ? 'text-white border-b-2 border-indigo-500' : 'text-slate-600 hover:text-slate-300'}`}
                            >
                                {tab.icon}
                                <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                                {tab.count > 0 && (
                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10 text-slate-500">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Conditional Grid Content */}
                    {activeTab === 'sparks' ? (
                        <div className="max-w-2xl mx-auto">
                            <Feed
                                posts={userPosts}
                                onLike={onLike}
                                onDelete={onDelete}
                                onAddComment={onAddComment}
                                onDeleteComment={onDeleteComment}
                                onLikeComment={onLikeComment}
                                currentUsername={username}
                            />
                            {userPosts.length === 0 && (
                                <div className="py-32 text-center glass-card-premium rounded-[3rem] border-dashed border-white/5">
                                    <Grid size={48} className="mx-auto text-slate-800 mb-6" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Your gallery is empty</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-40 text-center">
                            <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Under Construction</h3>
                            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Curation module coming soon</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
