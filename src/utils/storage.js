import { supabase } from './supabase';

export const getPosts = async () => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return data;
};

export const addPost = async (content, username) => {
    const { data, error } = await supabase
        .from('posts')
        .insert([{ content, username, likes: 0, comments: [] }])
        .select();

    if (error) {
        console.error('Error adding post:', error);
        return null;
    }
    return data[0];
};

export const deletePost = async (id) => {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        return false;
    }
    return true;
};

export const toggleLike = async (id, currentLikes) => {
    const { data, error } = await supabase
        .from('posts')
        .update({ likes: currentLikes + 1 })
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error toggling like:', error);
        return null;
    }
    return data[0];
};

export const addComment = async (postId, content, username) => {
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('comments')
        .eq('id', postId)
        .single();

    if (fetchError) return null;

    const newComment = {
        id: Date.now(),
        username,
        content,
        likes: 0,
        createdAt: new Date().toISOString()
    };

    const currentComments = post.comments || [];
    const updatedComments = [newComment, ...currentComments];

    const { data, error } = await supabase
        .from('posts')
        .update({ comments: updatedComments })
        .eq('id', postId)
        .select();

    if (error) {
        console.error('Error adding comment:', error);
        return null;
    }
    return data ? data[0] : null;
};

export const deleteComment = async (postId, commentId) => {
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('comments')
        .eq('id', postId)
        .single();

    if (fetchError) return null;

    const currentComments = post.comments || [];
    const updatedComments = currentComments.filter(c => c.id !== commentId);

    const { data, error } = await supabase
        .from('posts')
        .update({ comments: updatedComments })
        .eq('id', postId)
        .select();

    if (error) {
        console.error('Error deleting comment:', error);
        return null;
    }
    return data ? data[0] : null;
};

export const toggleCommentLike = async (postId, commentId) => {
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('comments')
        .eq('id', postId)
        .single();

    if (fetchError) return null;

    const currentComments = post.comments || [];
    const updatedComments = currentComments.map(c => {
        if (c.id === commentId) {
            return { ...c, likes: c.likes + 1 };
        }
        return c;
    });

    const { data, error } = await supabase
        .from('posts')
        .update({ comments: updatedComments })
        .eq('id', postId)
        .select();

    if (error) {
        console.error('Error toggling comment like:', error);
        return null;
    }
    return data ? data[0] : null;
};
