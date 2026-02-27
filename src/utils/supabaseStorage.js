import { supabase } from './supabase';

/**
 * Fetch all posts with their likes and comments from Supabase.
 * Uses a robust approach: tries full query first, falls back to simpler query if needed.
 */
export const fetchSupabasePosts = async () => {
    try {
        // Try the full nested query with comment_likes
        const { data: posts, error } = await supabase
            .from('posts')
            .select(`
                *,
                post_likes (username),
                comments (
                    *,
                    comment_likes (username)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Full query failed, trying without comment_likes:', error.message);
            // Fallback: fetch without comment_likes join (in case table doesn't exist yet)
            return await fetchPostsSimple();
        }

        return posts.map(post => ({
            id: post.id,
            content: post.content,
            username: post.username,
            media: post.media,
            mediaType: post.media_type,
            createdAt: post.created_at,
            likes: (post.post_likes || []).map(l => l.username),
            comments: (post.comments || []).map(comment => ({
                id: comment.id,
                content: comment.content,
                username: comment.username,
                createdAt: comment.created_at,
                likes: (comment.comment_likes || []).map(l => l.username)
            })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return await fetchPostsSimple();
    }
};

/**
 * Simpler fallback query without comment_likes join.
 */
const fetchPostsSimple = async () => {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select(`
                *,
                post_likes (username),
                comments (*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Simple query also failed:', error.message);
            return [];
        }

        return posts.map(post => ({
            id: post.id,
            content: post.content,
            username: post.username,
            media: post.media,
            mediaType: post.media_type,
            createdAt: post.created_at,
            likes: (post.post_likes || []).map(l => l.username),
            comments: (post.comments || []).map(comment => ({
                id: comment.id,
                content: comment.content,
                username: comment.username,
                createdAt: comment.created_at,
                likes: []
            })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }));
    } catch (error) {
        console.error('Fallback query failed:', error);
        return [];
    }
};

/**
 * Create a new post in Supabase.
 */
export const insertSupabasePost = async (content, username, media = null, mediaType = null) => {
    const { data, error } = await supabase
        .from('posts')
        .insert([{ content, username, media, media_type: mediaType }])
        .select()
        .single();

    if (error) {
        console.error('Error inserting post:', error);
        return null;
    }

    return {
        ...data,
        mediaType: data.media_type,
        likes: [],
        comments: []
    };
};

/**
 * Toggle like for a post in Supabase.
 */
export const toggleSupabasePostLike = async (postId, username) => {
    const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('username', username)
        .maybeSingle();

    if (existingLike) {
        await supabase.from('post_likes').delete().eq('id', existingLike.id);
    } else {
        await supabase.from('post_likes').insert([{ post_id: postId, username }]);
    }
    return true;
};

/**
 * Add a comment to a post in Supabase.
 */
export const insertSupabaseComment = async (postId, content, username) => {
    const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, content, username }])
        .select()
        .single();

    if (error) {
        console.error('Error inserting comment:', error);
        return null;
    }

    return { ...data, likes: [] };
};

/**
 * Toggle like for a comment in Supabase.
 */
export const toggleSupabaseCommentLike = async (commentId, username) => {
    const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('username', username)
        .maybeSingle();

    if (existingLike) {
        await supabase.from('comment_likes').delete().eq('id', existingLike.id);
    } else {
        await supabase.from('comment_likes').insert([{ comment_id: commentId, username }]);
    }
    return true;
};

/**
 * Fetch top trending hashtags from post content.
 */
export const fetchTrendingTags = async () => {
    try {
        const { data, error } = await supabase.from('posts').select('content');
        if (error) throw error;

        const tagCounts = {};
        data.forEach(post => {
            const tags = post.content.match(/#\w+/g) || [];
            tags.forEach(tag => {
                const cleanTag = tag.slice(1);
                tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
            });
        });

        return Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, posts: count }))
            .sort((a, b) => b.posts - a.posts)
            .slice(0, 5);
    } catch (error) {
        console.error('Error fetching trending tags:', error);
        return [];
    }
};

/**
 * Fetch suggested creators (excluding current user).
 */
export const fetchSuggestedCreators = async (currentUserId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', currentUserId || '00000000-0000-0000-0000-000000000000')
            .limit(5);

        if (error) throw error;
        return data.map(p => ({
            id: p.id,
            name: p.username,
            role: p.role || 'Explorer',
            initial: (p.username || 'A').charAt(0).toUpperCase()
        }));
    } catch (error) {
        console.error('Error fetching suggested creators:', error);
        return [];
    }
};

/**
 * Fetch real user stats (followers, following, posts).
 */
export const fetchUserStats = async (userId) => {
    if (!userId) return { followers: '0', following: '0', posts: '0' };

    try {
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', userId).single();
        const username = profile?.username;

        const [followers, following, posts] = await Promise.all([
            supabase.from('follows').select('id', { count: 'exact' }).eq('following_id', userId),
            supabase.from('follows').select('id', { count: 'exact' }).eq('follower_id', userId),
            username ? supabase.from('posts').select('id', { count: 'exact' }).eq('username', username) : Promise.resolve({ count: 0 })
        ]);

        return {
            followers: followers.count?.toString() || '0',
            following: following.count?.toString() || '0',
            posts: posts.count?.toString() || '0'
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return { followers: '0', following: '0', posts: '0' };
    }
};

export const deleteSupabasePost = async (postId) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
        console.error('Error deleting post:', error);
        return null;
    }
    return true;
};

/**
 * Toggle follow/unfollow for a user.
 */
export const toggleSupabaseFollow = async (followerId, followingId) => {
    const { data: existing } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();

    if (existing) {
        await supabase.from('follows').delete().eq('id', existing.id);
    } else {
        await supabase.from('follows').insert([{ follower_id: followerId, following_id: followingId }]);
    }
    return true;
};

/**
 * Delete a comment from Supabase.
 */
export const deleteSupabaseComment = async (commentId) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) {
        console.error('Error deleting comment:', error);
        return null;
    }
    return true;
};
