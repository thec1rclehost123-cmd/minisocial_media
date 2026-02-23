import React, { useState } from 'react';
import { Heart, Trash2, User, MessageCircle, Send, Share2, Bookmark, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post, onLike, onDelete, onAddComment, onDeleteComment, onLikeComment, currentUsername }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleAddComment = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(post.id, commentText);
            setCommentText('');
        }
    };

    const roles = ['Digital Artist', 'UI Designer', 'Photographer', 'Creative Director', 'Architect', 'Musician'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];

    const comments = post.comments || [];
    const postLikes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = postLikes.includes(currentUsername);

    return (
        <div className="group relative break-inside-avoid mb-8 rounded-[2.5rem] overflow-hidden glass-card-premium animate-reveal flex flex-col">
            {/* Pinterest Style Hover Overlay */}
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-6">
                <div className="flex gap-4 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <button
                        onClick={() => onLike(post.id)}
                        className={`p-5 rounded-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl ${isLiked ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white hover:text-slate-900 border border-white/10'}`}
                    >
                        <Heart size={26} className={isLiked ? "fill-current" : ""} />
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`p-5 rounded-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl ${showComments ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white hover:bg-white hover:text-slate-900 border border-white/10'}`}
                    >
                        <MessageCircle size={26} />
                    </button>
                    <button
                        onClick={() => onDelete(post.id)}
                        className="p-5 rounded-3xl bg-white/10 text-white hover:bg-rose-600 border border-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl"
                    >
                        <Trash2 size={26} />
                    </button>
                </div>
                <div className="flex gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                    <div className="text-center">
                        <p className="text-xl font-black text-white">{postLikes.length}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Likes</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-black text-white">{comments.length}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Sparks</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-lg font-black text-white">{post.username?.charAt(0).toUpperCase() || "A"}</span>
                        </div>
                        <div>
                            <h4 className="text-base font-black text-white tracking-tight leading-none mb-1">{post.username || "Anonymous"}</h4>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                {post.role || randomRole}
                            </p>
                        </div>
                    </div>
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                <p className="text-slate-200 leading-relaxed text-[16px] font-medium mb-6">
                    {post.content}
                </p>

                {post.media && (
                    <div className="relative rounded-[2rem] overflow-hidden bg-black/40 border border-white/5 shadow-inner group/media mb-6">
                        {post.mediaType === 'image' ? (
                            <img src={post.media} alt="Post media" className="w-full h-auto object-cover transition-transform duration-1000 group-hover/media:scale-110" />
                        ) : post.mediaType === 'video' ? (
                            <video src={post.media} controls className="w-full h-auto" />
                        ) : null}

                        {/* Carousel Mockup Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500">
                            {[1, 2, 3].map(dot => (
                                <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot === 1 ? 'bg-white' : 'bg-white/30'}`}></div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-slate-500">
                        <button className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-white'}`}>
                            <Heart size={18} className={isLiked ? "fill-current" : ""} /> {postLikes.length}
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
                            <MessageCircle size={18} /> {comments.length}
                        </button>
                        <button className="hover:text-white transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>
                    <button className="text-slate-600 hover:text-indigo-400 transition-colors">
                        <Bookmark size={20} />
                    </button>
                </div>
            </div>

            {/* Comments Drawer (Glass Sub-panel) */}
            {showComments && (
                <div className="bg-black/20 backdrop-blur-2xl border-t border-white/10 p-6 flex flex-col gap-6 animate-reveal">
                    <form onSubmit={handleAddComment} className="relative flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add your spark..."
                            className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="p-4 bg-indigo-600 text-white rounded-2xl transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </form>

                    <div className="flex flex-col gap-5 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                        {comments.length > 0 ? comments.map((comment) => (
                            <div key={comment.id} className="group/comment flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/5 flex items-center justify-center shrink-0 font-bold text-slate-400 text-xs shadow-inner">
                                    {comment.username?.charAt(0).toUpperCase() || "A"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div>
                                            <span className="text-sm font-black text-white">{comment.username || "Anonymous"}</span>
                                            <span className="ml-3 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Just now</span>
                                        </div>
                                        <div className="flex items-center gap-3 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                                            <button onClick={() => onLikeComment(post.id, comment.id)} className="text-slate-600 hover:text-rose-500 transition-colors">
                                                <Heart size={14} className={comment.likes?.includes(currentUsername) ? "fill-current" : ""} />
                                            </button>
                                            <button onClick={() => onDeleteComment(post.id, comment.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-8 text-center">
                                <MessageCircle size={32} className="mx-auto text-slate-800 mb-3" />
                                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No sparks yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
