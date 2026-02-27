import { supabase } from './supabase';

/**
 * =====================================
 * FEED & POSTS
 * =====================================
 */

/**
 * Fetch all posts for the feed, with author profile, like count, and comment count.
 */
export async function getFeedPosts() {
    const { data, error } = await supabase
        .from('posts')
        .select(`
      id,
      content,
      image_url,
      created_at,
      user_id,
      profiles:user_id (id, username, avatar_url),
      likes:likes(count),
      comments:comments(count)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching feed:', error);
        throw error;
    }
    return data;
}

/**
 * Get an array of post IDs that the current user has liked.
 * Used to check if the heart should be filled.
 */
export async function getUserLikedPostIds(userId) {
    const { data, error } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map(l => l.post_id);
}

/**
 * Create a new post.
 */
export async function createPost(userId, content, imageUrl = null) {
    const { data, error } = await supabase
        .from('posts')
        .insert([{ user_id: userId, content, image_url: imageUrl }])
        .select()
        .single();

    if (error) {
        console.error('Error creating post:', error);
        throw error;
    }
    return data;
}

/**
 * =====================================
 * INTERACTIONS (LIKE & COMMENT)
 * =====================================
 */

/**
 * Toggle a like for a specific post.
 */
export async function toggleLike(userId, postId) {
    const { data: existingLike, error: findError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

    if (findError) throw findError;

    if (existingLike) {
        const { error } = await supabase.from('likes').delete().eq('id', existingLike.id);
        if (error) throw error;
        return 'unliked';
    } else {
        const { error } = await supabase.from('likes').insert([{ post_id: postId, user_id: userId }]);
        if (error) throw error;
        return 'liked';
    }
}

/**
 * Add a comment to a post.
 */
export async function addComment(userId, postId, content) {
    const { data, error } = await supabase
        .from('comments')
        .insert([{ user_id: userId, post_id: postId, content }])
        .select(`
      *,
      profiles:user_id (id, username, avatar_url)
    `)
        .single();

    if (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
    return data;
}

/**
 * Fetch comments for a specific post, with author profiles.
 */
export async function getPostComments(postId) {
    const { data, error } = await supabase
        .from('comments')
        .select(`
      id,
      content,
      created_at,
      user_id,
      profiles:user_id (id, username, avatar_url)
    `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

/**
 * =====================================
 * FOLLOWS & USERS
 * =====================================
 */

/**
 * Toggle a follow relationship.
 */
export async function toggleFollow(followerId, followingId) {
    const { data: existing, error: findError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();

    if (findError) throw findError;

    if (existing) {
        const { error } = await supabase.from('follows').delete().eq('id', existing.id);
        if (error) throw error;
        return 'unfollowed';
    } else {
        const { error } = await supabase.from('follows').insert([{ follower_id: followerId, following_id: followingId }]);
        if (error) throw error;
        return 'followed';
    }
}

/**
 * Get an array of user IDs that the current user is following.
 * Used for client-side follow state tracking.
 */
export async function getFollowingIds(currentUserId) {
    const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', currentUserId);

    if (error) throw error;
    return (data || []).map(f => f.following_id);
}

/**
 * Get suggestions for users to follow.
 * Excludes the current user and people they already follow.
 */
export async function getSuggestedUsers(currentUserId) {
    const { data: followingList, error: followError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', currentUserId);

    if (followError) throw followError;

    const exclusionIds = followingList?.map(f => f.following_id) || [];
    exclusionIds.push(currentUserId);

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, bio')
        .not('id', 'in', `(${exclusionIds.join(',')})`)
        .limit(5);

    if (error) throw error;
    return data;
}

/**
 * =====================================
 * NOTIFICATIONS
 * =====================================
 */

export async function getNotifications(userId) {
    const { data, error } = await supabase
        .from('notifications')
        .select(`
      id,
      type,
      is_read,
      created_at,
      post_id,
      actor:actor_id (id, username, avatar_url)
    `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function markNotificationsRead(userId) {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);

    if (error) throw error;
}

/**
 * =====================================
 * REALTIME SUBSCRIPTIONS
 * =====================================
 */

export function subscribeToFeedUpdates(onInsert, onDelete) {
    return supabase.channel('public:posts')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
            onInsert(payload.new);
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, payload => {
            onDelete(payload.old);
        })
        .subscribe();
}

export function subscribeToNotifications(userId, onNotification) {
    return supabase.channel(`public:notifications:recipient_id=eq.${userId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${userId}`
        }, payload => {
            onNotification(payload.new);
        })
        .subscribe();
}
