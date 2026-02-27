import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';

import Navbar from './components/Navbar';
import PostInput from './components/PostInput';
import UsernameInput from './components/UsernameInput';
import Feed from './components/Feed';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import ProfileView from './components/ProfileView';
import NotificationsModal from './components/NotificationsModal';
import EditIdentityModal from './components/EditIdentityModal';
import InteractiveBackground from './components/InteractiveBackground';
import MobileBottomNav from './components/MobileBottomNav';
import { supabase } from './lib/supabase';
import {
    getFeedPosts,
    createPost,
    toggleLike,
    addComment,
    toggleFollow,
    getSuggestedUsers,
    getFollowingIds,
    getNotifications,
    getUserLikedPostIds,
    subscribeToFeedUpdates,
    subscribeToNotifications,
} from './lib/supabaseAPI';

function App() {
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [currentView, setCurrentView] = useState('home');

    // Sidebar data
    const [trendingTags, setTrendingTags] = useState([]);
    const [suggestedCreators, setSuggestedCreators] = useState([]);
    const [userStats, setUserStats] = useState({ followers: '0', following: '0', posts: '0' });
    const [likedPostIds, setLikedPostIds] = useState([]);
    const [followingIds, setFollowingIds] = useState([]);
    const [followLoadingIds, setFollowLoadingIds] = useState(new Set());

    // Edit Profile modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Notification states
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

    /**
     * Fetch all data from Supabase. Called on mount & after auth changes.
     */
    const loadContent = useCallback(async (currentSession) => {
        const activeSession = currentSession || session;
        if (!activeSession) return;

        const uid = activeSession.user.id;

        // Fetch feed posts (all users)
        try {
            const feedPosts = await getFeedPosts();
            setPosts(feedPosts || []);
        } catch (err) {
            console.error('Feed fetch error:', err);
        }

        // Fetch user's liked post IDs
        try {
            const likedIds = await getUserLikedPostIds(uid);
            setLikedPostIds(likedIds || []);
        } catch (err) {
            console.error('Liked posts fetch error:', err);
        }

        // Fetch user profile
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', uid)
                .maybeSingle();
            if (profile?.username) {
                setUsername(profile.username);
            }
        } catch (err) {
            console.error('Profile fetch error:', err);
        }

        // Fetch trending tags from posts content
        try {
            const { data: allPosts } = await supabase.from('posts').select('content');
            const tagMap = {};
            (allPosts || []).forEach(p => {
                const matches = p.content?.match(/#(\w+)/g) || [];
                matches.forEach(tag => {
                    const clean = tag.slice(1).toLowerCase();
                    tagMap[clean] = (tagMap[clean] || 0) + 1;
                });
            });
            const sorted = Object.entries(tagMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([tag, posts]) => ({ tag, posts }));
            setTrendingTags(sorted);
        } catch (err) {
            console.error('Trending tags error:', err);
        }

        // Fetch suggested users and following IDs
        try {
            const [suggested, followIds] = await Promise.all([
                getSuggestedUsers(uid),
                getFollowingIds(uid),
            ]);
            setSuggestedCreators(suggested || []);
            setFollowingIds(followIds || []);
        } catch (err) {
            console.error('Suggested users / following error:', err);
        }

        // Fetch notifications
        try {
            const notifs = await getNotifications(uid);
            setNotifications(notifs || []);
        } catch (err) {
            console.error('Notifications fetch error:', err);
        }

        try {
            const { count: postCount } = await supabase
                .from('posts').select('*', { count: 'exact', head: true }).eq('user_id', uid);
            const { count: followerCount } = await supabase
                .from('follows').select('*', { count: 'exact', head: true }).eq('following_id', uid);
            const { count: followingCount } = await supabase
                .from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', uid);
            setUserStats({
                posts: String(postCount || 0),
                followers: String(followerCount || 0),
                following: String(followingCount || 0),
            });
        } catch (err) {
            console.error('User stats error:', err);
        }
    }, [session]);

    // Bootstrap App
    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            if (!isMounted) return;

            setSession(initialSession);
            if (initialSession) {
                setUserId(initialSession.user.id);
                await loadContent(initialSession);
            }
            if (isMounted) setAuthLoading(false);
        };

        init();

        // Auth Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (!isMounted) return;
            setSession(newSession);
            if (newSession) {
                setUserId(newSession.user.id);
                loadContent(newSession);
            } else {
                setUserId(null);
                setUsername('');
                setPosts([]);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Realtime subscription for posts
    useEffect(() => {
        if (!session) return;

        const channel = subscribeToFeedUpdates(
            async () => {
                // On any INSERT, refetch entire feed to get full joined data
                try {
                    const feedPosts = await getFeedPosts();
                    setPosts(feedPosts || []);
                } catch (err) { console.error(err); }
            },
            async () => {
                // On DELETE, also refetch
                try {
                    const feedPosts = await getFeedPosts();
                    setPosts(feedPosts || []);
                } catch (err) { console.error(err); }
            }
        );

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session]);

    const filteredPosts = useMemo(() => {
        let result = posts;
        if (selectedTag) {
            result = result.filter(post => post.content?.toLowerCase().includes(`#${selectedTag.toLowerCase()}`));
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post =>
                (post.content?.toLowerCase().includes(query)) ||
                (post.profiles?.username?.toLowerCase().includes(query))
            );
        }
        return result;
    }, [posts, searchQuery, selectedTag]);

    const handleSaveUsername = async (name) => {
        if (!userId) return;
        try {
            // Upsert the profile with the chosen username
            const { error } = await supabase.from('profiles').upsert({
                id: userId,
                username: name,
            }, { onConflict: 'id' });
            if (error) throw error;
            setUsername(name);
        } catch (err) {
            console.error('Save username error:', err);
            alert('Username might already be taken. Try another one.');
        }
    };

    const handleAddPost = async (content, imageUrl) => {
        if (!userId) return;
        try {
            await createPost(userId, content, imageUrl);
            // Realtime subscription will refetch feed automatically
            // But also update stats
            const { count } = await supabase
                .from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId);
            setUserStats(prev => ({ ...prev, posts: String(count || 0) }));
            // Re-compute trending tags
            const { data: allPosts } = await supabase.from('posts').select('content');
            const tagMap = {};
            (allPosts || []).forEach(p => {
                const matches = p.content?.match(/#(\w+)/g) || [];
                matches.forEach(tag => {
                    const clean = tag.slice(1).toLowerCase();
                    tagMap[clean] = (tagMap[clean] || 0) + 1;
                });
            });
            const sorted = Object.entries(tagMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([tag, posts]) => ({ tag, posts }));
            setTrendingTags(sorted);
        } catch (err) {
            console.error('Add post error:', err);
        }
    };

    const handleDeletePost = async (id) => {
        if (!userId) return;
        try {
            const { error } = await supabase.from('posts').delete().eq('id', id).eq('user_id', userId);
            if (error) throw error;
            // Optimistically remove from state, realtime will confirm
            setPosts(prev => prev.filter(p => p.id !== id));
            const { count } = await supabase
                .from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId);
            setUserStats(prev => ({ ...prev, posts: String(count || 0) }));
        } catch (err) {
            console.error('Delete post error:', err);
        }
    };

    const handleLikePost = async (postId) => {
        if (!userId) return;
        try {
            // Optimistically toggle locally
            setLikedPostIds(prev =>
                prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
            );
            await toggleLike(userId, postId);
            // Refetch feed to get updated like counts
            const feedPosts = await getFeedPosts();
            setPosts(feedPosts || []);
        } catch (err) {
            console.error('Like error:', err);
            // Revert on failure
            const likedIds = await getUserLikedPostIds(userId);
            setLikedPostIds(likedIds || []);
        }
    };

    const handleFollowCreator = async (creatorId) => {
        if (!userId) return;

        // Prevent duplicate requests
        if (followLoadingIds.has(creatorId)) return;

        const isCurrentlyFollowing = followingIds.includes(creatorId);

        // Optimistic UI: toggle follow state & counts immediately
        setFollowLoadingIds(prev => new Set(prev).add(creatorId));
        setFollowingIds(prev =>
            isCurrentlyFollowing ? prev.filter(id => id !== creatorId) : [...prev, creatorId]
        );
        setUserStats(prev => ({
            ...prev,
            following: String(
                Math.max(0, Number(prev.following) + (isCurrentlyFollowing ? -1 : 1))
            ),
        }));

        try {
            await toggleFollow(userId, creatorId);
        } catch (err) {
            console.error('Follow error:', err);
            // Rollback on failure
            setFollowingIds(prev =>
                isCurrentlyFollowing ? [...prev, creatorId] : prev.filter(id => id !== creatorId)
            );
            setUserStats(prev => ({
                ...prev,
                following: String(
                    Math.max(0, Number(prev.following) + (isCurrentlyFollowing ? 1 : -1))
                ),
            }));
        } finally {
            setFollowLoadingIds(prev => {
                const next = new Set(prev);
                next.delete(creatorId);
                return next;
            });
        }
    };

    const handleAddComment = async (postId, content) => {
        if (!userId) return;
        try {
            await addComment(userId, postId, content);
            // Refetch feed to get updated comment data
            const feedPosts = await getFeedPosts();
            setPosts(feedPosts || []);
        } catch (err) {
            console.error('Comment error:', err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!userId) return;
        try {
            const { error } = await supabase.from('comments').delete().eq('id', commentId).eq('user_id', userId);
            if (error) throw error;
            const feedPosts = await getFeedPosts();
            setPosts(feedPosts || []);
        } catch (err) {
            console.error('Delete comment error:', err);
        }
    };

    const handleMarkNotificationsRead = async () => {
        if (!userId) return;
        try {
            const { markNotificationsRead } = await import('./lib/supabaseAPI');
            await markNotificationsRead(userId);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    };

    /**
     * Save profile changes from EditIdentityModal (sidebar "Edit Profile" button).
     */
    const handleSaveProfile = async (profileData) => {
        if (!session) return false;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ username: profileData.username })
                .eq('id', session.user.id);
            if (error) throw error;
            setUsername(profileData.username);
            return true;
        } catch (err) {
            console.error('Profile update error:', err);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUserId(null);
        setUsername('');
        setCurrentView('home');
        setPosts([]);
    };

    const handlePlusClick = () => {
        if (currentView !== 'home') {
            setCurrentView('home');
        }
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const input = document.getElementById('main-post-input');
            if (input) input.focus();
        }, 100);
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
                            setSearchQuery('');
                        }}
                        currentView={currentView}
                        onNotificationsClick={() => setShowNotifications(true)}
                        unreadCount={unreadCount}
                    />

                    <main className="relative z-10 pt-28 sm:pt-48 pb-24 max-w-7xl mx-auto px-3 sm:px-6">
                        {currentView === 'home' ? (
                            <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
                                {/* Left/Center Column: Feed & Input */}
                                <div className="flex-1 min-w-0">
                                    <div className="max-w-2xl mx-auto">
                                        <div className="mb-12">
                                            <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Home</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Curated Sparks Everywhere</p>
                                        </div>

                                        {username ? (
                                            <PostInput onAddPost={handleAddPost} username={username} />
                                        ) : (
                                            <UsernameInput onSave={handleSaveUsername} />
                                        )}

                                        <Feed
                                            posts={filteredPosts}
                                            onLike={handleLikePost}
                                            onDelete={handleDeletePost}
                                            onAddComment={handleAddComment}
                                            onDeleteComment={handleDeleteComment}
                                            currentUsername={username}
                                            currentUserId={userId}
                                            likedPostIds={likedPostIds}
                                        />

                                        {filteredPosts.length === 0 && (
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
                                            followingIds={followingIds}
                                            followLoadingIds={followLoadingIds}
                                            onEditProfile={() => setShowEditModal(true)}
                                        />
                                    </div>
                                </aside>
                            </div>
                        ) : (
                            <ProfileView
                                posts={posts}
                                username={username}
                                userId={userId}
                                stats={userStats}
                                onLike={handleLikePost}
                                onDelete={handleDeletePost}
                                onAddComment={handleAddComment}
                                onDeleteComment={handleDeleteComment}
                                session={session}
                                onUsernameChange={(newName) => setUsername(newName)}
                                likedPostIds={likedPostIds}
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
            {/* Modals */}
            <NotificationsModal
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationsRead}
                currentUserId={userId}
                onFollow={handleFollowCreator}
                followingIds={followingIds}
                followLoadingIds={followLoadingIds}
            />
            <EditIdentityModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                initialData={{
                    username: username,
                    email: session?.user?.email || '',
                }}
                onSave={handleSaveProfile}
                isSaving={isSaving}
            />

            <MobileBottomNav
                currentView={currentView}
                onHomeClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onNotificationsClick={() => setShowNotifications(true)}
                onProfileClick={() => setCurrentView('profile')}
                unreadCount={unreadCount}
                onPlusClick={handlePlusClick}
            />
        </div>
    );
}

export default App;
