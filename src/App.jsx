import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CreatePost from './components/CreatePost';
import Feed from './components/Feed';
import { getPosts, addPost, deletePost, toggleLike } from './utils/storage';

function App() {
    const [posts, setPosts] = useState([]);

    // Load posts on initial render
    useEffect(() => {
        setPosts(getPosts());
    }, []);

    const handleAddPost = (content) => {
        const newPost = addPost(content);
        setPosts([newPost, ...posts]);
    };

    const handleDeletePost = (id) => {
        deletePost(id);
        setPosts(posts.filter(post => post.id !== id));
    };

    const handleLikePost = (id) => {
        toggleLike(id);
        setPosts(posts.map(post => {
            if (post.id === id) {
                return { ...post, likes: post.likes + 1 };
            }
            return post;
        }));
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden">
            {/* Background blobs for premium feel */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full z-0"></div>

            <Navbar />

            <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6">
                {/* Welcome Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Curate your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Creative Space</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A minimal place to share ideas, bookmarks, and sparks of inspiration with your team.
                    </p>
                </div>

                <CreatePost onAddPost={handleAddPost} />

                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-xl font-semibold">Latest Inspiration</h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                    </div>
                    <Feed
                        posts={posts}
                        onLike={handleLikePost}
                        onDelete={handleDeletePost}
                    />
                </div>
            </main>

            <footer className="relative z-10 border-t border-white/5 py-10 text-center text-slate-500 text-sm">
                <p>&copy; 2026 MiniSocial Project. Built with Teamwork.</p>
            </footer>
        </div>
    );
}

export default App;
