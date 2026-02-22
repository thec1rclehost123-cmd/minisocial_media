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

export const addPost = async (content, userId) => {
    const { data, error } = await supabase
        .from('posts')
        .insert([{ content, user_id: userId }])
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
