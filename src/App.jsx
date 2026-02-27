import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';

import Navbar from './components/Navbar';
import PostInput from './components/PostInput';
import Feed from './components/Feed';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import ProfileView from './components/ProfileView';
import InteractiveBackground from './components/InteractiveBackground';
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
    const [currentView, setCurrentView] = useState('home');

    // Sidebar data
    const [trendingTags, setTrendingTags] = useState([]);
    const [suggestedCreators, setSuggestedCreators] = useState([]);
    const [userStats, setUserStats] = useState({ followers: '0', following: '0', posts: '0' });

    /**
     * Load all data from Supabase. No localStorage fallback — purely cloud.
     */
    const loadContent = useCallback(async (currentSession) => {
        // Fetch all community posts from Supabase
        const allPosts = await fetchSupabasePosts();
        setPosts(allPosts);

        // Sidebar data
        const tags = await fetchTrendingTags();
        setTrendingTags(tags);

        // User-specific data
        const activeSession = currentSession || session;
        if (activeSession) {
            const userId = activeSession.user.id;

            const [suggested, stats] = await Promise.all([
                fetchSuggestedCreators(userId),
                fetchUserStats(userId)
            ]);
            setSuggestedCreators(suggested);
            setUserStats(stats);

            // Get username from Supabase profile (single source of truth)
            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', userId)
                .maybeSingle();

            if (profile?.username) {
                setUsername(profile.username);
            } else {
                // Profile exists but no username — use email prefix
                const emailPrefix = activeSession.user.email?.split('@')[0] || 'User';
                setUsername(emailPrefix);
            }
        }
    }, [session]);

    // Bootstrap App
    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            if (!isMounted) return;

            setSession(initialSession);
            await loadContent(initialSession);

            if (isMounted) setAuthLoading(false);
        };

        init();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (!isMounted) return;
            setSession(newSession);
            if (newSession) loadContent(newSession);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Filtered posts for search and tag filtering
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

    // --- Handlers (all Supabase, no localStorage) ---

    const handleSaveUsername = async (name) => {
        setUsername(name);
        if (session) {
            await supabase.from('profiles').update({ username: name }).eq('id', session.user.id);
        }
    };

    const handleAddPost = async (content, media, mediaType) => {
        const result = await insertSupabasePost(content, username, media, mediaType);
        if (result) {
            setPosts(prev => [result, ...prev]);
            // Refresh sidebar data
            const tags = await fetchTrendingTags();
            setTrendingTags(tags);
            if (session) {
                const stats = await fetchUserStats(session.user.id);
                setUserStats(stats);
            }
        }
    };

    const handleDeletePost = async (id) => {
        const result = await deleteSupabasePost(id);
        if (result) {
            setPosts(prev => prev.filter(p => p.id !== id));
            if (session) {
                const stats = await fetchUserStats(session.user.id);
                setUserStats(stats);
            }
        }
    };

    const handleLikePost = async (id) => {
        await toggleSupabasePostLike(id, username);
        const updatedPosts = await fetchSupabasePosts();
        setPosts(updatedPosts);
    };

    const handleFollowCreator = async (creatorId) => {
        if (!session) return;
        await toggleSupabaseFollow(session.user.id, creatorId);
        const [stats, suggested] = await Promise.all([
            fetchUserStats(session.user.id),
            fetchSuggestedCreators(session.user.id)
        ]);
        setUserStats(stats);
        setSuggestedCreators(suggested);
    };

    const handleAddComment = async (postId, content) => {
        await insertSupabaseComment(postId, content, username);
        const updatedPosts = await fetchSupabasePosts();
        setPosts(updatedPosts);
    };

    const handleDeleteComment = async (postId, commentId) => {
        await deleteSupabaseComment(commentId);
        const updatedPosts = await fetchSupabasePosts();
        setPosts(updatedPosts);
    };

    const handleLikeComment = async (postId, commentId) => {
        await toggleSupabaseCommentLike(commentId, username);
        const updatedPosts = await fetchSupabasePosts();
        setPosts(updatedPosts);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUsername('');
        setCurrentView('home');
        setPosts([]);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden selection:bg-indigo-500/30">
            <InteractiveBackground />

            {authLoading ? (
                <div className="min-h-screen flex items-center justify-center relative z-20">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-2xl shadow-indigo-500/20"></div>
                </div>
            ) : !session ? (
                <div className="relative z-20">
                    <Auth onAuthSuccess={() => loadContent()} />
                </div>
            ) : (
                <>
                    <Navbar
                        onSearch={setSearchQuery}
                        username={username}
                        onProfileClick={() => setCurrentView('profile')}
                        onHomeClick={() => {
                            setCurrentView('home');
                            setSelectedTag(null);
                        }}
                        currentView={currentView}
                    />

                    <main className="relative z-10 pt-48 pb-24 max-w-7xl mx-auto px-6">
                        {currentView === 'home' ? (
                            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                                {/* Left/Center Column: Feed & Input */}
                                <div className="flex-1 min-w-0">
                                    <div className="max-w-2xl mx-auto">
                                        <div className="mb-12">
                                            <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Home</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Curated Sparks Everywhere</p>
                                        </div>

                                        {username && (
                                            <PostInput onAddPost={handleAddPost} username={username} />
                                        )}

                                        <Feed
                                            posts={filteredPosts}
                                            onLike={handleLikePost}
                                            onDelete={handleDeletePost}
                                            onAddComment={handleAddComment}
                                            onDeleteComment={handleDeleteComment}
                                            onLikeComment={handleLikeComment}
                                            currentUsername={username}
                                        />

                                        {filteredPosts.length === 0 && posts.length > 0 && (
                                            <div className="py-24 text-center border-x border-b border-white/5 bg-white/[0.01]">
                                                <Search size={48} className="mx-auto text-slate-800 mb-6" />
                                                <h4 className="text-2xl font-black text-slate-500">No matching sparks</h4>
                                            </div>
                                        )}
                                    </div>
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
                        ) : (
                            <ProfileView
                                posts={posts}
                                username={username}
                                stats={userStats}
                                onLike={handleLikePost}
                                onDelete={handleDeletePost}
                                onAddComment={handleAddComment}
                                onDeleteComment={handleDeleteComment}
                                onLikeComment={handleLikeComment}
                            />
                        )}
                    </main>

                    <footer className="relative z-10 border-t border-white/5 py-20 bg-slate-950/30 backdrop-blur-xl">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-10">
                            <div className="flex items-center gap-4 opacity-30">
                                <span className="text-2xl font-black tracking-tighter">MiniSocial</span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="bg-rose-500/10 text-rose-500 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-2xl hover:shadow-rose-500/30"
                            >
                                Deauthenticate Session
                            </button>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
}

export default App;
