import React from 'react';
import { TrendingUp, Users, ChevronRight, Hash } from 'lucide-react';
import ProfileCard from './ProfileCard';

const Sidebar = ({ username, trendingTags = [], suggestedCreators = [], userStats, onTagClick, onFollow, selectedTag }) => {
    return (
        <div className="flex flex-col gap-8 w-full max-w-xs animate-reveal delay-200">
            {/* User Profile Card */}
            <ProfileCard username={username} stats={userStats} />

            {/* Trending Topics */}
            <div className="glass-card-premium rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-8">
                    <TrendingUp size={20} className="text-indigo-400" />
                    <h4 className="font-black text-lg tracking-tight">Trending Topics</h4>
                </div>
                <div className="space-y-6">
                    {trendingTags.length > 0 ? trendingTags.map((item, i) => (
                        <div
                            key={i}
                            className={`group flex items-center justify-between cursor-pointer transition-all ${selectedTag === item.tag ? 'bg-white/5 -mx-4 px-4 py-2 rounded-xl' : ''}`}
                            onClick={() => onTagClick(item.tag)}
                        >
                            <div>
                                <p className={`text-sm font-black transition-colors flex items-center gap-2 ${selectedTag === item.tag ? 'text-indigo-400' : 'text-white group-hover:text-indigo-400'}`}>
                                    <Hash size={14} className={selectedTag === item.tag ? 'text-indigo-500' : 'text-slate-600'} /> {item.tag}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-black mt-1">{item.posts} posts</p>
                            </div>
                            <ChevronRight size={16} className={`transition-all ${selectedTag === item.tag ? 'text-indigo-400' : 'text-slate-700 group-hover:text-white group-hover:translate-x-1'}`} />
                        </div>
                    )) : (
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">No tags yet</p>
                    )}
                </div>
            </div>

            {/* Suggested Creators */}
            <div className="glass-card-premium rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-8">
                    <Users size={20} className="text-purple-400" />
                    <h4 className="font-black text-lg tracking-tight">Suggested Creators</h4>
                </div>
                <div className="space-y-8">
                    {suggestedCreators.length > 0 ? suggestedCreators.map((creator, i) => (
                        <div key={creator.id || i} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-black text-indigo-400 shadow-inner">
                                    {creator.username?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-black text-white leading-none mb-1.5 truncate">{creator.username || 'Unknown'}</p>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black leading-none truncate">{creator.bio || 'Creator'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onFollow(creator.id)}
                                className="px-5 py-2 rounded-xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all active:scale-95 shadow-2xl"
                            >
                                Follow
                            </button>
                        </div>
                    )) : (
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Finding creators...</p>
                    )}
                </div>
                <button className="w-full mt-10 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                    Explore All
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
