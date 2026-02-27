import React, { useState, useEffect } from 'react';
import { Heart, Trash2, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { getPostComments } from '../lib/supabaseAPI';

const PostCard = ({ post, onLike, onDelete, onAddComment, onDeleteComment, currentUsername, currentUserId, isLiked }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // Derive display data from the relational shape
    const authorUsername = post.profiles?.username || 'Anonymous';
    const authorAvatar = post.profiles?.avatar_url;
    const likeCount = post.likes?.[0]?.count || 0;
    const commentCount = post.comments?.[0]?.count || 0;

    const roles = ['Digital Artist', 'UI Designer', 'Photographer', 'Creative Director', 'Architect', 'Musician'];
    const randomRole = roles[Math.floor(Math.random() * (post.id?.length || 6)) % roles.length];

    // Fetch comments from Supabase when the section is expanded
    const handleToggleComments = async () => {
        const next = !showComments;
        setShowComments(next);
        if (next) {
            setLoadingComments(true);
            try {
                const data = await getPostComments(post.id);
                setComments(data || []);
            } catch (err) {
                console.error('Error fetching comments:', err);
            } finally {
                setLoadingComments(false);
            }
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            await onAddComment(post.id, commentText);
            setCommentText('');
            // Refetch comments after adding
            try {
                const data = await getPostComments(post.id);
                setComments(data || []);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        await onDeleteComment(post.id, commentId);
        // Refetch comments after deleting
        try {
            const data = await getPostComments(post.id);
            setComments(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Format relative time
    const getRelativeTime = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h`;
        const days = Math.floor(hrs / 24);
        return `${days}d`;
    };

    return (
        <div className="group relative p-6 hover:bg-white/[0.02] transition-all duration-300 animate-reveal flex gap-5">
            {/* Avatar Column */}
            <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-sm font-black text-white">{authorUsername?.charAt(0).toUpperCase() || "A"}</span>
                </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
                {/* Header Info */}
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white hover:underline cursor-pointer">{authorUsername}</span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">• {randomRole}</span>
                    </div>
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                {/* Body Content */}
                <p className="text-slate-200 leading-relaxed text-[15px] font-medium mb-4 whitespace-pre-wrap">
                    {post.content}
                </p>

                {/* Media (if exists) */}
                {post.image_url && (
                    <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner mb-4 max-h-[500px] flex items-center justify-center">
                        <img src={post.image_url} alt="Post media" className="w-full h-auto object-contain max-h-[500px]" />
                    </div>
                )}

                {/* Actions Row */}
                <div className="flex items-center justify-between max-w-md -ml-2 text-slate-500">
                    <button
                        onClick={handleToggleComments}
                        className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest p-2 rounded-full transition-all group/action hover:text-indigo-400 hover:bg-indigo-400/10 ${showComments ? 'text-indigo-400 bg-indigo-400/5' : ''}`}
                    >
                        <MessageCircle size={18} className="group-hover/action:scale-110 transition-transform" />
                        <span>{commentCount}</span>
                    </button>

                    <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest p-2 rounded-full transition-all group/action hover:text-rose-500 hover:bg-rose-500/10 ${isLiked ? 'text-rose-500 bg-rose-500/5' : ''}`}
                    >
                        <Heart size={18} className={`group-hover/action:scale-110 transition-transform ${isLiked ? "fill-current text-rose-500" : ""}`} />
                        <span>{likeCount}</span>
                    </button>

                    <button className="p-2 rounded-full hover:bg-white/5 transition-all text-slate-600 hover:text-white">
                        <Share2 size={18} />
                    </button>

                    {post.user_id === currentUserId && (
                        <button
                            onClick={() => onDelete(post.id)}
                            className="p-2 rounded-full hover:bg-rose-500/10 transition-all text-slate-600 hover:text-rose-500"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-6 pt-6 border-t border-white/5 animate-reveal">
                        <form onSubmit={handleAddComment} className="flex gap-4 mb-6">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-black">{currentUsername?.charAt(0).toUpperCase() || "U"}</span>
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Post your reply..."
                                    className="w-full bg-transparent border-none text-sm text-slate-200 placeholder:text-slate-600 focus:ring-0 py-1.5 font-medium"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        disabled={!commentText.trim()}
                                        className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:shadow-none hover:bg-indigo-500 transition-all"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </form>

                        {loadingComments ? (
                            <div className="text-center py-4">
                                <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">Loading...</span>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/5 flex items-center justify-center shrink-0 font-bold text-slate-400 text-[10px]">
                                            {comment.profiles?.username?.charAt(0).toUpperCase() || "A"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-black text-white">{comment.profiles?.username || "Anonymous"}</span>
                                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">• {getRelativeTime(comment.created_at)}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                                {comment.content}
                                            </p>
                                            <div className="flex gap-4 mt-2">
                                                {comment.user_id === currentUserId && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-slate-600 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
