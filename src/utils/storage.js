const STORAGE_KEY = 'minisocial_posts';

export const getPosts = () => {
    const posts = localStorage.getItem(STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
};

export const savePosts = (posts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const addPost = (content) => {
    const posts = getPosts();
    const newPost = {
        id: Date.now(),
        content,
        likes: 0,
        timestamp: new Date().toISOString()
    };
    savePosts([newPost, ...posts]);
    return newPost;
};

export const deletePost = (id) => {
    const posts = getPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    savePosts(filteredPosts);
};

export const toggleLike = (id) => {
    const posts = getPosts();
    const updatedPosts = posts.map(post => {
        if (post.id === id) {
            return { ...post, likes: post.likes + 1 };
        }
        return post;
    });
    savePosts(updatedPosts);
};
