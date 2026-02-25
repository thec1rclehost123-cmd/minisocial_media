import { supabase } from './supabase';

/**
 * Fetch all posts with their likes and comments from Supabase.
 * Maps the Supabase structure to the expected frontend structure for compatibility.
 */
export const fetchSupabasePosts = async () => {
    if (!supabase) return null;

    try {
        const { data: posts, error: postsError } = await supabase
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

        if (postsError) throw postsError;

        // Transform data to match frontend expectations
        return posts.map(post => ({
            id: post.id,
            content: post.content,
            username: post.username,
            media: post.media,
            mediaType: post.media_type,
            createdAt: post.created_at,
            // Map likes array of objects to array of usernames
            likes: post.post_likes.map(l => l.username),
            comments: (post.comments || []).map(comment => ({
                id: comment.id,
                content: comment.content,
                username: comment.username,
                createdAt: comment.created_at,
                // Map likes array of objects to array of usernames
                likes: comment.comment_likes.map(l => l.username)
            })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }));
    } catch (error) {
        console.error('Error fetching from Supabase:', error);
        return null;
    }
};

/**
 * Create a new post in Supabase.
 */
export const insertSupabasePost = async (content, username, media = null, mediaType = null) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([{ content, username, media, media_type: mediaType }])
            .select()
            .single();

        if (error) throw error;

        // Return in frontend format
        return {
            ...data,
            mediaType: data.media_type,
            likes: [],
            comments: []
        };
    } catch (error) {
        console.error('Error inserting to Supabase:', error);
        return null;
    }
};

/**
 * Toggle like for a post in Supabase using a separate likes table.
 */
export const toggleSupabasePostLike = async (postId, username) => {
    if (!supabase) return null;

    try {
        // Check if already liked
        const { data: existingLike, error: fetchError } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('username', username)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingLike) {
            // Unlike
            const { error: deleteError } = await supabase
                .from('post_likes')
                .delete()
                .eq('id', existingLike.id);
            if (deleteError) throw deleteError;
        } else {
            // Like
            const { error: insertError } = await supabase
                .from('post_likes')
                .insert([{ post_id: postId, username }]);
            if (insertError) throw insertError;
        }

        return true;
    } catch (error) {
        console.error('Error toggling post like in Supabase:', error);
        return null;
    }
};

/**
 * Add a comment to a post in Supabase.
 */
export const insertSupabaseComment = async (postId, content, username) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ post_id: postId, content, username }])
            .select()
            .single();

        if (error) throw error;

        return {
            ...data,
            likes: []
        };
    } catch (error) {
        console.error('Error inserting comment to Supabase:', error);
        return null;
    }
};

/**
 * Toggle like for a comment in Supabase.
 */
export const toggleSupabaseCommentLike = async (commentId, username) => {
    if (!supabase) return null;

    try {
        const { data: existingLike, error: fetchError } = await supabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', commentId)
            .eq('username', username)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingLike) {
            const { error: deleteError } = await supabase
                .from('comment_likes')
                .delete()
                .eq('id', existingLike.id);
            if (deleteError) throw deleteError;
        } else {
            const { error: insertError } = await supabase
                .from('comment_likes')
                .insert([{ comment_id: commentId, username }]);
            if (insertError) throw insertError;
        }

        return true;
    } catch (error) {
        console.error('Error toggling comment like in Supabase:', error);
        return null;
    }
};

/**
 * Fetch top trending hashtags from post content.
 */
export const fetchTrendingTags = async () => {
    if (!supabase) return [];

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
    if (!supabase) return [];

    try {
        const { data: creators, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', currentUserId || '00000000-0000-0000-0000-000000000000')
            .limit(5);

        if (error) throw error;

        // If logged in, check which creators are already followed
        let followedIds = new Set();
        if (currentUserId) {
            const { data: follows } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', currentUserId);

            if (follows) {
                followedIds = new Set(follows.map(f => f.following_id));
            }
        }

        return creators.map(p => ({
            id: p.id,
            name: p.username,
            role: p.role || 'Explorer',
            initial: (p.username || 'A').charAt(0).toUpperCase(),
            isFollowing: followedIds.has(p.id)
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
    if (!supabase || !userId) return { followers: '0', following: '0', posts: '0' };

    try {
        // Get username first
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
    if (!supabase) return null;

    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting post from Supabase:', error);
        return null;
    }
};

/**
 * Toggle follow/unfollow for a user.
 */
export const toggleSupabaseFollow = async (followerId, followingId) => {
    if (!supabase) return null;

    try {
        const { data: existing, error: fetchError } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (existing) {
            const { error: deleteError } = await supabase
                .from('follows')
                .delete()
                .eq('id', existing.id);
            if (deleteError) throw deleteError;
        } else {
            const { error: insertError } = await supabase
                .from('follows')
                .insert([{ follower_id: followerId, following_id: followingId }]);
            if (insertError) throw insertError;
        }

        return true;
    } catch (error) {
        console.error('Error toggling follow:', error);
        return null;
    }
};

/**
 * Delete a comment from Supabase.
 */
export const deleteSupabaseComment = async (commentId) => {
    if (!supabase) return null;

    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting comment from Supabase:', error);
        return null;
    }
};
