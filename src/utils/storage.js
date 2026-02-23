const STORAGE_KEY = 'posts';
const USERNAME_KEY = 'username';

export const getUsername = () => {
    return localStorage.getItem(USERNAME_KEY) || '';
};

export const saveUsername = (username) => {
    localStorage.setItem(USERNAME_KEY, username);
};

export const getPosts = () => {
    const posts = localStorage.getItem(STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
};

export const savePosts = (posts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const addPost = (content, username, media = null, mediaType = null) => {
    const posts = getPosts();
    const newPost = {
        id: Date.now(),
        username,
        content,
        media,
        mediaType,
        likes: [],
        createdAt: new Date().toISOString()
    };
    savePosts([newPost, ...posts]);
    return newPost;
};

export const deletePost = (id) => {
    const posts = getPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    savePosts(filteredPosts);
    return true;
};

export const toggleLike = (id, username) => {
    const posts = getPosts();
    let updatedPost = null;
    const updatedPosts = posts.map(post => {
        if (post.id === id) {
            let currentLikes = Array.isArray(post.likes) ? [...post.likes] : [];
            
            if (currentLikes.includes(username)) {
                // Unlike: remove user from likes
                currentLikes = currentLikes.filter(u => u !== username);
            } else {
                // Like: add user to likes
                currentLikes.push(username);
            }
            
            updatedPost = { ...post, likes: currentLikes };
            return updatedPost;
        }
        return post;
    });
    savePosts(updatedPosts);
    return updatedPost;
};

export const addComment = (postId, content, username) => {
    const posts = getPosts();
    const updatedPosts = posts.map(post => {
        if (post.id === postId) {
            const newComment = {
                id: Date.now(),
                username,
                content,
                likes: [],
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

export const toggleCommentLike = (postId, commentId, username) => {
    const posts = getPosts();
    const updatedPosts = posts.map(post => {
        if (post.id === postId) {
            const currentComments = post.comments || [];
            const updatedComments = currentComments.map(c => {
                if (c.id === commentId) {
                    let currentLikes = Array.isArray(c.likes) ? [...c.likes] : [];
                    
                    if (currentLikes.includes(username)) {
                        // Unlike
                        currentLikes = currentLikes.filter(u => u !== username);
                    } else {
                        // Like
                        currentLikes.push(username);
                    }
                    
                    return { ...c, likes: currentLikes };
                }
                return c;
            });
            return { ...post, comments: updatedComments };
        }
        return post;
    });
    savePosts(updatedPosts);
};
