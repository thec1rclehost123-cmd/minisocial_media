import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostInput from './components/PostInput';
import UsernameInput from './components/UsernameInput';
import Feed from './components/Feed';
import { getPosts, addPost, deletePost, toggleLike, getUsername, saveUsername, addComment, deleteComment, toggleCommentLike } from './utils/storage';
import {
    fetchSupabasePosts,
    insertSupabasePost,
    toggleSupabasePostLike,
    insertSupabaseComment,
    toggleSupabaseCommentLike,
    deleteSupabasePost,
    deleteSupabaseComment
} from './utils/supabaseStorage';

function App() {
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState('');

    // Load posts and username on initial render
    // Load posts and username on initial render
    useEffect(() => {
        const loadInitialData = async () => {
            setUsername(getUsername());

            // Try fetching from Supabase first
            const supabasePosts = await fetchSupabasePosts();
            if (supabasePosts) {
                setPosts(supabasePosts);
            } else {
                // Fallback to local storage
                setPosts(getPosts());
            }
        };

        loadInitialData();
    }, []);

    const handleSaveUsername = (name) => {
        saveUsername(name);
        setUsername(name);
    }

    const handleAddPost = async (content, media, mediaType) => {
        // Optimistic UI update or just wait for Supabase
        const result = await insertSupabasePost(content, username, media, mediaType);

        if (result) {
            setPosts([result, ...posts]);
        } else {
            // Fallback to local storage
            const newPost = addPost(content, username, media, mediaType);
            setPosts([newPost, ...posts]);
        }
    };

    const handleDeletePost = async (id) => {
        const result = await deleteSupabasePost(id);

        if (result !== null) {
            setPosts(posts.filter(post => post.id !== id));
        } else {
            // Fallback
            deletePost(id);
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    const handleLikePost = async (id) => {
        const result = await toggleSupabasePostLike(id, username);

        if (result !== null) {
            // Refetch to get updated state across users
            const updatedPosts = await fetchSupabasePosts();
            if (updatedPosts) {
                setPosts(updatedPosts);
                return;
            }
        }

        // Fallback or if result was null (Supabase error)
        toggleLike(id, username);
        const updatedPostsLocal = getPosts();
        setPosts(updatedPostsLocal);
    };

    const handleAddComment = async (postId, content) => {
        const result = await insertSupabaseComment(postId, content, username);

        if (result) {
            const updatedPosts = await fetchSupabasePosts();
            if (updatedPosts) setPosts(updatedPosts);
        } else {
            // Fallback
            addComment(postId, content, username);
            setPosts(getPosts());
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        const result = await deleteSupabaseComment(commentId);

        if (result !== null) {
            const updatedPosts = await fetchSupabasePosts();
            if (updatedPosts) setPosts(updatedPosts);
        } else {
            // Fallback
            deleteComment(postId, commentId);
            setPosts(getPosts());
        }
    };

    const handleLikeComment = async (postId, commentId) => {
        const result = await toggleSupabaseCommentLike(commentId, username);

        if (result !== null) {
            const updatedPosts = await fetchSupabasePosts();
            if (updatedPosts) {
                setPosts(updatedPosts);
                return;
            }
        }

        // Fallback
        toggleCommentLike(postId, commentId, username);
        setPosts(getPosts());
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

                {username ? (
                    <PostInput onAddPost={handleAddPost} />
                ) : (
                    <UsernameInput onSave={handleSaveUsername} />
                )}

                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-xl font-semibold">Latest Inspiration</h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                    </div>
                    <Feed
                        posts={posts}
                        onLike={handleLikePost}
                        onDelete={handleDeletePost}
                        onAddComment={handleAddComment}
                        onDeleteComment={handleDeleteComment}
                        onLikeComment={handleLikeComment}
                        currentUsername={username}
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
