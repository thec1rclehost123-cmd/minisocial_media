import React, { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';

import Navbar from './components/Navbar';
import PostInput from './components/PostInput';
import UsernameInput from './components/UsernameInput';
import Feed from './components/Feed';
import Auth from './components/Auth';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import { getPosts, addPost, deletePost, toggleLike, getUsername, saveUsername, addComment, deleteComment, toggleCommentLike } from './utils/storage';
import {
    fetchSupabasePosts,
    insertSupabasePost,
    toggleSupabasePostLike,
    insertSupabaseComment,
    toggleSupabaseCommentLike,
    deleteSupabasePost,
    deleteSupabaseComment,
    fetchTrendingTags,
    fetchSuggestedCreators,
    fetchUserStats,
    toggleSupabaseFollow
} from './utils/supabaseStorage';
import { supabase } from './utils/supabase';

function App() {
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState('');
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    // Real Data States
    const [trendingTags, setTrendingTags] = useState([]);
    const [suggestedCreators, setSuggestedCreators] = useState([]);
    const [userStats, setUserStats] = useState({ followers: '0', following: '0', posts: '0' });

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            setUsername(getUsername());
            const supabasePosts = await fetchSupabasePosts();
            if (supabasePosts) setPosts(supabasePosts);
            else setPosts(getPosts());

            const tags = await fetchTrendingTags();
            setTrendingTags(tags);
        };
        loadInitialData();

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchSuggestedCreators(session.user.id).then(setSuggestedCreators);
                fetchUserStats(session.user.id).then(setUserStats);
            }
            setAuthLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchSuggestedCreators(session.user.id).then(setSuggestedCreators);
                fetchUserStats(session.user.id).then(setUserStats);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const filteredPosts = useMemo(() => {
        let result = posts;
        if (selectedTag) {
            result = result.filter(post => post.content?.toLowerCase().includes(`#${selectedTag.toLowerCase()}`));
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post =>
                (post.content?.toLowerCase().includes(query)) ||
                (post.username?.toLowerCase().includes(query))
            );
        }
        return result;
    }, [posts, searchQuery, selectedTag]);

    const handleSaveUsername = (name) => {
        saveUsername(name);
        setUsername(name);
    }

    const handleAddPost = async (content, media, mediaType) => {
        const result = await insertSupabasePost(content, username, media, mediaType);
        if (result) {
            setPosts([result, ...posts]);
            fetchTrendingTags().then(setTrendingTags);
            if (session) fetchUserStats(session.user.id).then(setUserStats);
        } else {
            const newPost = addPost(content, username, media, mediaType);
            setPosts([newPost, ...posts]);
        }
    };

    const handleDeletePost = async (id) => {
        const result = await deleteSupabasePost(id);
        if (result !== null) {
            setPosts(posts.filter(post => post.id !== id));
            if (session) fetchUserStats(session.user.id).then(setUserStats);
        } else {
            deletePost(id);
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    const handleLikePost = async (id) => {
        const result = await toggleSupabasePostLike(id, username);
        if (result !== null) {
            const updatedPosts = await fetchSupabasePosts();
            if (updatedPosts) {
                setPosts(updatedPosts);
                return;
            }
        }
        toggleLike(id, username);
        setPosts(getPosts());
    };

    const handleFollowCreator = async (creatorId) => {
        if (!session) return;
        const result = await toggleSupabaseFollow(session.user.id, creatorId);
        if (result) {
            fetchUserStats(session.user.id).then(setUserStats);
            fetchSuggestedCreators(session.user.id).then(setSuggestedCreators);
        }
    };

    const handleAddComment = async (postId, content) => {
        const result = await insertSupabaseComment(postId, content, username);
        if (result) {
            const updatedPosts = await fetchSupabasePosts();
            if (updatedPosts) setPosts(updatedPosts);
        } else {
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
            deleteComment(postId, commentId);
            setPosts(getPosts());
        }
    };

    const handleLikeComment = async (postId, commentId) => {
        const result = await toggleSupabaseCommentLike(commentId, username);
        if (result !== null) {
            const updatedPosts = await fetchSupabasePosts();
            if (updatedPosts) setPosts(updatedPosts);
        } else {
            toggleCommentLike(postId, commentId, username);
            setPosts(getPosts());
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-2xl shadow-indigo-500/20"></div>
            </div>
        );
    }

    if (!session) {
        return <Auth onAuthSuccess={() => { }} />;
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden selection:bg-indigo-500/30">
            {/* Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/[0.07] blur-[150px] rounded-full z-0 animate-pulse-soft"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-600/[0.07] blur-[150px] rounded-full z-0 animate-float"></div>

            <Navbar onSearch={setSearchQuery} username={username} />

            <main className="relative z-10 pt-48 pb-24 max-w-7xl mx-auto px-6">
                <Hero />

                {username ? (
                    <PostInput onAddPost={handleAddPost} />
                ) : (
                    <UsernameInput onSave={handleSaveUsername} />
                )}

                <div className="mt-32 flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Feed */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-16">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-4xl font-black tracking-tighter text-white">
                                        {selectedTag ? `#${selectedTag}` : 'Latest Inspiration'}
                                    </h3>
                                    {selectedTag && (
                                        <button
                                            onClick={() => setSelectedTag(null)}
                                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">Sparks from around the globe</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex px-4 py-2 rounded-xl bg-white/5 border border-white/10 items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">24 Visionaries Live</span>
                                </div>
                            </div>
                        </div>

                        <Feed
                            posts={filteredPosts}
                            onLike={handleLikePost}
                            onDelete={handleDeletePost}
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                            onLikeComment={handleLikeComment}
                            currentUsername={username}
                        />

                        {filteredPosts.length === 0 && (
                            <div className="py-20 text-center glass-card-premium rounded-[3rem] border-dashed">
                                <Search size={48} className="mx-auto text-slate-800 mb-6" />
                                <h4 className="text-2xl font-black text-slate-500 mb-2">No matching sparks found</h4>
                                <p className="text-slate-600 font-medium">Try broadening your search or follow more creators.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="hidden lg:block w-80 shrink-0">
                        <div className="sticky top-48">
                            <Sidebar
                                username={username}
                                trendingTags={trendingTags}
                                suggestedCreators={suggestedCreators}
                                userStats={userStats}
                                onTagClick={setSelectedTag}
                                onFollow={handleFollowCreator}
                                selectedTag={selectedTag}
                            />
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="relative z-10 border-t border-white/5 py-20 bg-slate-950/30 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-10">
                    <div className="flex items-center gap-4 opacity-30">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">
                            <span className="text-slate-950 font-black">M</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter">MiniSocial</span>
                    </div>
                    <p className="text-slate-600 text-sm max-w-md text-center font-medium leading-relaxed">
                        A curated sanctuary for the modern creator. Built with obsession for detail, logic, and aesthetic excellence.
                    </p>
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex gap-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
                            <span className="hover:text-indigo-400 cursor-pointer">Terms</span>
                            <span className="hover:text-indigo-400 cursor-pointer">Privacy</span>
                            <span className="hover:text-indigo-400 cursor-pointer">Manifesto</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="bg-rose-500/10 text-rose-500 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-2xl hover:shadow-rose-500/30"
                        >
                            Deauthenticate Session
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
