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

export const addPost = (content, username) => {
    const posts = getPosts();
    const newPost = {
        id: Date.now(),
        username,
        content,
        likes: 0,
        createdAt: new Date().toISOString()
    };
    savePosts([newPost, ...posts]);
    return newPost;
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

export const addComment = (postId, content, username) => {
    const posts = getPosts();
    const updatedPosts = posts.map(post => {
        if (post.id === postId) {
            const newComment = {
                id: Date.now(),
                username,
                content,
                likes: 0,
                createdAt: new Date().toISOString()
            };
            const currentComments = post.comments || [];
            return { ...post, comments: [newComment, ...currentComments] };
        }
        return post;
    });
    savePosts(updatedPosts);
};

export const deleteComment = (postId, commentId) => {
    const posts = getPosts();
    const updatedPosts = posts.map(post => {
        if (post.id === postId) {
            const currentComments = post.comments || [];
            return { ...post, comments: currentComments.filter(c => c.id !== commentId) };
        }
        return post;
    });
    savePosts(updatedPosts);
};

export const toggleCommentLike = (postId, commentId) => {
    const posts = getPosts();
    const updatedPosts = posts.map(post => {
        if (post.id === postId) {
            const currentComments = post.comments || [];
            const updatedComments = currentComments.map(c => {
                if (c.id === commentId) {
                    return { ...c, likes: c.likes + 1 };
                }
                return c;
            });
            return { ...post, comments: updatedComments };
        }
        return post;
    });
    savePosts(updatedPosts);
};
