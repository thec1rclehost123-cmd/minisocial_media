import React from 'react';
import PostCard from './PostCard';

const Feed = ({ posts, onLike, onDelete, onAddComment, onDeleteComment, currentUsername, currentUserId, likedPostIds = [] }) => {
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500 animate-reveal">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 shadow-2xl">
                    <span className="text-5xl">✨</span>
                </div>
                <p className="text-xl font-medium tracking-tight">No sparks found. Be the one to start the fire.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-0 border-x border-white/5 bg-white/[0.01]">
            {posts.map((post) => (
                <div key={post.id} className="border-b border-white/5">
                    <PostCard
                        post={post}
                        onLike={onLike}
                        onDelete={onDelete}
                        onAddComment={onAddComment}
                        onDeleteComment={onDeleteComment}
                        currentUsername={currentUsername}
                        currentUserId={currentUserId}
                        isLiked={likedPostIds.includes(post.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Feed;
