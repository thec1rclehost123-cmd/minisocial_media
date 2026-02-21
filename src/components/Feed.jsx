import React from 'react';
import PostCard from './PostCard';

const Feed = ({ posts, onLike, onDelete }) => {
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <span className="text-4xl">✨</span>
                </div>
                <p className="text-lg">No posts yet. Be the first to inspire!</p>
            </div>
        );
    }

    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto px-4">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={onLike}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default Feed;
