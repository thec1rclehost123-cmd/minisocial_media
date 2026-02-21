import React from 'react';
import { Heart, Trash2, User } from 'lucide-react';

const PostCard = ({ post, onLike, onDelete }) => {
    return (
        <div className="group relative break-inside-avoid mb-6 rounded-3xl overflow-hidden glass transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-[1.02]">
            {/* Content Area */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{post.username || "Anonymous"}</span>
                </div>

                <p className="text-slate-100 leading-relaxed">
                    {post.content}
                </p>

                <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                        <Heart size={14} className={post.likes > 0 ? "fill-rose-500 text-rose-500" : ""} />
                        <span>{post.likes}</span>
                    </div>
                </div>
            </div>

            {/* Hover Overlay Actions (Pinterest Style) */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-end p-4 gap-2">
                <button
                    onClick={() => onLike(post.id)}
                    className="p-3 rounded-full bg-white text-slate-900 hover:bg-rose-500 hover:text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                    title="Like"
                >
                    <Heart size={20} className={post.likes > 0 ? "fill-current" : ""} />
                </button>
                <button
                    onClick={() => onDelete(post.id)}
                    className="p-3 rounded-full bg-white text-slate-900 hover:bg-red-500 hover:text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                    title="Delete"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default PostCard;
