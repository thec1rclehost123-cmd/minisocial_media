import React, { useState } from 'react';
import { Heart, Trash2, User, MessageCircle, Send } from 'lucide-react';

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

    const comments = post.comments || [];
    const postLikes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = postLikes.includes(currentUsername);

    return (
        <div className="group relative break-inside-avoid mb-6 rounded-3xl overflow-hidden glass transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-[1.02] flex flex-col">
            {/* Content Area */}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{post.username || "Anonymous"}</span>
                </div>

                <p className="text-slate-100 leading-relaxed break-words whitespace-pre-wrap">
                    {post.content}
                </p>

                {post.media && (
                    <div className="mt-4 rounded-2xl overflow-hidden bg-black/20 border border-white/5">
                        {post.mediaType === 'image' ? (
                            <img src={post.media} alt="Post media" className="w-full h-auto object-cover" />
                        ) : post.mediaType === 'video' ? (
                            <video src={post.media} controls className="w-full h-auto" />
                        ) : null}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                        >
                            <MessageCircle size={14} className={comments.length > 0 ? "text-indigo-400" : ""} />
                            <span>{comments.length}</span>
                        </button>
                        <div className="flex items-center gap-1">
                            <Heart size={14} className={postLikes.length > 0 ? (isLiked ? "fill-rose-500 text-rose-500" : "text-rose-500") : ""} />
                            <span>{postLikes.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="bg-black/20 border-t border-white/5 p-4 flex flex-col gap-4">
                    {/* Add Comment */}
                    <form onSubmit={handleAddComment} className="flex gap-2 isolate relative z-10">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:bg-slate-700 text-white rounded-xl transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </form>

                    {/* Comments List */}
                    {comments.length > 0 && (
                        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar isolate relative z-10">
                            {comments.map((comment) => (
                                <div key={comment.id} className="group/comment flex items-start gap-3 text-sm">
                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                        <User size={12} className="text-slate-400" />
                                    </div>
                                    <div className="flex-1 bg-white/5 rounded-2xl rounded-tl-none p-3 relative">
                                        <div className="flex items-baseline justify-between mb-1">
                                            <span className="font-semibold text-slate-300">{comment.username || "Anonymous"}</span>
                                        </div>
                                        <p className="text-slate-200 break-words">{comment.content}</p>

                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                            <button
                                                onClick={() => onLikeComment(post.id, comment.id)}
                                                className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                                            >
                                                {(() => {
                                                    const commentLikes = Array.isArray(comment.likes) ? comment.likes : [];
                                                    const isCommentLiked = commentLikes.includes(currentUsername);
                                                    return (
                                                        <>
                                                            <Heart size={12} className={commentLikes.length > 0 ? (isCommentLiked ? "fill-rose-500 text-rose-500" : "text-rose-500") : ""} />
                                                            <span>{commentLikes.length}</span>
                                                        </>
                                                    );
                                                })()}
                                            </button>
                                            <button
                                                onClick={() => onDeleteComment(post.id, comment.id)}
                                                className="opacity-0 group-hover/comment:opacity-100 hover:text-red-400 transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Hover Overlay Actions (Pinterest Style) */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-end p-4 gap-2 pointer-events-none">
                <button
                    onClick={() => onLike(post.id)}
                    className="p-3 rounded-full bg-white text-slate-900 hover:bg-rose-500 hover:text-white transition-all duration-200 transform hover:scale-110 shadow-lg pointer-events-auto"
                    title={isLiked ? "Unlike" : "Like"}
                >
                    <Heart size={20} className={isLiked ? "fill-current text-rose-500" : ""} />
                </button>
                <button
                    onClick={() => onDelete(post.id)}
                    className="p-3 rounded-full bg-white text-slate-900 hover:bg-red-500 hover:text-white transition-all duration-200 transform hover:scale-110 shadow-lg pointer-events-auto"
                    title="Delete"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default PostCard;
