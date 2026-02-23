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
 * Delete a post from Supabase.
 */
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
