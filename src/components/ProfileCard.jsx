import React from 'react';
import { Edit3 } from 'lucide-react';

const ProfileCard = ({ username, stats }) => {
    return (
        <div className="glass-card-premium rounded-[2.5rem] p-8 mb-8 relative overflow-hidden group">
            {/* Header / Cover area mockup */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 mb-4 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-[1.8rem] bg-[#020617] flex items-center justify-center font-black text-3xl text-white">
                        {username?.charAt(0).toUpperCase() || "D"}
                    </div>
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight mb-1">{username || "Explorer"}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Digital Visionary</p>

                <div className="flex gap-8 w-full justify-between mb-8 px-4">
                    <div className="text-center">
                        <p className="text-lg font-black text-white leading-none">{stats?.followers || '0'}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-black text-white leading-none">{stats?.following || '0'}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Following</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-black text-white leading-none">{stats?.posts || '0'}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Posts</p>
                    </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg">
                    <Edit3 size={14} /> Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
