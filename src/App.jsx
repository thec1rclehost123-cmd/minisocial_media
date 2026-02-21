import React, { useState } from 'react'
import {
    Home, MessageSquare, Bell, Users, Shield, Settings,
    Search, Image as ImageIcon, List, FileText, MapPin,
    Heart, Share2, MoreHorizontal, User, Sparkles, Plus,
    Hash, TrendingUp, ChevronRight, Bookmark, BookmarkCheck
} from 'lucide-react'

// Professional Demo Data matching reference
const DEMO_POSTS = [
    {
        id: 1,
        user: 'Andrew',
        action: 'shared a moments',
        time: '2h',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        content: 'The clarity of vision begins where the noise ends. Exploring the silent peaks today. ✨',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
        likes: 2450,
        comments: 128,
        liked: false,
        bookmarked: false
    },
    {
        id: 2,
        user: 'Astro Guy',
        action: 'captured the void',
        time: '5h',
        avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop',
        content: 'Architecture is just space waiting for light. A study in obsidian and glass.',
        image: 'https://images.unsplash.com/photo-146233194002ea-af46f6874eb7?w=1200&h=800&fit=crop',
        likes: 8900,
        comments: 442,
        liked: true,
        bookmarked: true
    }
]

const POPULAR_POSTS = [
    { id: 1, title: 'The Future of Minimal UI', snippet: 'Why less is becoming much more in 2026 design systems...', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    { id: 2, title: 'Obsidian Architecture', snippet: 'How materials define our digital expectations...', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop' },
    { id: 3, title: 'Mastering the Void', snippet: 'Spacing secrets of world-class web applications...', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' }
]

function App() {
    const [posts, setPosts] = useState(DEMO_POSTS)
    const [searchText, setSearchText] = useState('')

    const toggleLike = (id) => {
        setPosts(posts.map(p => p.id === id ? {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1
        } : p))
    }

    const toggleBookmark = (id) => {
        setPosts(posts.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))
    }

    return (
        <div className="dribbble-container bg-[#f8fafc]">
            {/* 1. Dark Sidebar Left */}
            <aside className="sidebar-dark w-[260px]">
                {/* User Profile */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-24 h-24 mb-6 relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <img
                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop"
                            className="w-full h-full rounded-full object-cover relative z-10 border-4 border-[#0f172a] group-hover:scale-105 transition-transform duration-500"
                            alt="Profile"
                        />
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-[#0f172a] rounded-full z-20"></div>
                    </div>
                    <h2 className="text-xl font-bold mb-1 tracking-tight">Daniel Williams</h2>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mb-8">Premium Curator</p>

                    <button className="btn-amber w-full flex items-center justify-center gap-3 click-scale group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Create Post
                    </button>
                </div>

                {/* Menus Section */}
                <div className="sidebar-header">General</div>
                <nav className="space-y-1">
                    {[
                        { icon: Home, label: 'Feed', active: true },
                        { icon: MessageSquare, label: 'Messages' },
                        { icon: Bell, label: 'Alerts' },
                        { icon: Users, label: 'Collective' },
                        { icon: Shield, label: 'Security' },
                        { icon: Settings, label: 'Settings' }
                    ].map((item, i) => (
                        <a key={i} href="#" className={`nav-item ${item.active ? 'active' : ''} group`}>
                            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>

                {/* Categories Section */}
                <div className="sidebar-header">Curation</div>
                <nav className="space-y-1">
                    {[
                        { icon: Hash, label: 'Aesthetics' },
                        { icon: Hash, label: 'Motion' },
                        { icon: Hash, label: 'Minimalism' },
                        { icon: Hash, label: 'Obsidian' }
                    ].map((item, i) => (
                        <a key={i} href="#" className="nav-item group">
                            <item.icon size={20} className="text-white/10 group-hover:text-amber-500 transition-colors" />
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>
            </aside>

            {/* 2. Main Center Content */}
            <main className="main-content scroll-area no-scrollbar">
                {/* Top Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className="search-glass group">
                        <Search size={18} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH THE VOID"
                            className="bg-transparent border-none outline-none w-full text-[10px] font-black tracking-[0.2em] placeholder:text-slate-300"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-50 cursor-pointer hover:shadow-md transition-shadow group">
                            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50&h=50&fit=crop" className="w-8 h-8 rounded-full border-2 border-slate-100" />
                            <span className="text-xs font-bold text-slate-600 group-hover:text-amber-600 transition-colors">Williams D.</span>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 transition-colors relative">
                                <Bell size={20} className="text-slate-400" />
                                <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                                <ImageIcon size={20} className="text-slate-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Post Creator Bar */}
                <div className="feed-card mb-12 py-6 px-8 flex items-center gap-6 group">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" className="w-14 h-14 rounded-2xl shadow-lg border-2 border-white" />
                    <div className="flex-1">
                        <input
                            placeholder="Whisper to the collective..."
                            className="bg-transparent w-full outline-none text-lg font-medium text-slate-800 placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex gap-3">
                        {[ImageIcon, List, Sparkles, MapPin].map((Icon, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer">
                                <Icon size={20} />
                            </div>
                        ))}
                        <button className="bg-amber-500 text-slate-900 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all ml-2">Post</button>
                    </div>
                </div>

                {/* Feed Posts */}
                <div className="space-y-12">
                    {posts.map(post => (
                        <article key={post.id} className="feed-card fade-in overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="avatar-ring p-1">
                                        <img src={post.avatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt={post.user} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            {post.user}
                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-black uppercase tracking-tighter">Verified</span>
                                        </h3>
                                        <p className="text-[10px] uppercase font-bold text-amber-500 tracking-widest opacity-80">
                                            {post.action} • {post.time} ago
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div
                                        onClick={() => toggleBookmark(post.id)}
                                        className={`p - 3 rounded - 2xl cursor - pointer transition - all ${post.bookmarked ? 'bg-slate-900 text-amber-400' : 'bg-slate-50 text-slate-300 hover:text-slate-600 hover:bg-slate-100'} `}
                                    >
                                        {post.bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-all">
                                        <MoreHorizontal size={20} />
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                                {post.content}
                            </p>

                            {post.image && (
                                <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 mb-8 relative group cursor-zoom-in">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                        <p className="text-white text-xs font-bold uppercase tracking-[0.3em]">View Full Resolution</p>
                                    </div>
                                    <img src={post.image} className="w-full object-cover max-h-[600px] group-hover:scale-105 transition-transform duration-1000" alt="Post" />
                                </div>
                            )}

                            <div className="flex justify-between items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-50">
                                <div className="flex gap-8">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        className={`flex items - center gap - 3 font - bold text - sm transition - all ${post.liked ? 'text-rose-500 transform scale-105' : 'text-slate-400 hover:text-rose-400'} `}
                                    >
                                        <Heart size={22} className={post.liked ? 'fill-current animate-pulse' : ''} />
                                        {post.likes.toLocaleString()}
                                    </button>
                                    <button className="flex items-center gap-3 text-slate-400 hover:text-amber-600 font-bold text-sm transition-colors">
                                        <MessageSquare size={22} />
                                        {post.comments}
                                    </button>
                                </div>
                                <button className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">
                                    <Share2 size={20} />
                                    Share
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {/* 3. Popular Panel Right */}
            <aside className="popular-panel w-[340px]">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                        <TrendingUp size={14} className="text-amber-500" /> Discover Popular
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-300 cursor-pointer hover:text-amber-500 transition-colors">Archived</span>
                </div>

                <div className="space-y-6">
                    {POPULAR_POSTS.map(item => (
                        <div key={item.id} className="popular-card group cursor-pointer">
                            <div className="flex gap-5 items-start">
                                <img src={item.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-white group-hover:rotate-3 transition-transform" />
                                <div className="flex-1">
                                    <h4 className="text-base font-bold text-slate-900 mb-1 leading-tight">{item.title}</h4>
                                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed opacity-80">{item.snippet}</p>
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <button className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 group-hover:text-slate-900 transition-colors">
                                    Read Entry <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium Upgrade Card */}
                <div className="mt-12 bg-[#0f172a] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
                    <div className="relative z-10">
                        <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em] mb-4">Edition Noir</p>
                        <h4 className="text-3xl font-black mb-6 italic tracking-tighter leading-none">The Obsidian<br />Waitlist</h4>
                        <button className="bg-amber-500 text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-amber-500/20">Reserve Access</button>
                    </div>
                    <Sparkles className="absolute -bottom-8 -right-8 text-white/5 opacity-40 rotate-12" size={200} />
                </div>

                <footer className="mt-12 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300/50 leading-loose">
                    Privacy Policy • Security Protocol • Terms of Service • MiniSocial Collective © 2026
                </footer>
            </aside>
        </div>
    )
}

export default App
