import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThumbsUp, MessageCircle, Share, Send } from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import Header from '@/components/core/Header';
import PostCard from '@/components/custom/PostCard';
import { communityPosts } from '@/data/mockData';
import Colors from '@/constants/Colors';
import { Post } from '@/types/Post';
import { createPost, getPosts, updatePostLikes } from '@/services/firebase';
import { useAuth } from '@/context/AuthContext';

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // Load posts from Firebase on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const firebasePosts = await getPosts();
      // Transform Firebase data to match Post type
      const transformedPosts = firebasePosts.map((post: any) => ({
        id: post.postId || post.id,
        user: {
          id: post.userId || 'unknown',
          name: post.userName || 'Anonymous',
          avatar:
            post.userAvatar ||
            'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        },
        content: post.content,
        images: post.images || [],
        timestamp: post.createdAt?.toDate?.() || new Date().toISOString(),
        likes: post.likes ? Object.keys(post.likes).length : 0,
        comments: post.comments || 0,
        liked: user?.uid ? post.likes?.[user.uid] || false : false,
      }));
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      Alert.alert('Error', 'Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please log in to like posts.');
      return;
    }

    try {
      const currentPost = posts.find((p) => p.id === postId);
      if (!currentPost) return;

      const newLiked = !currentPost.liked;
      await updatePostLikes(postId, user.uid, newLiked);

      // Update local state
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: newLiked,
                likes: newLiked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to update like:', error);
      Alert.alert('Error', 'Failed to update like. Please try again.');
    }
  };

  const handlePostComment = (postId: string) => {
    // For now, just log the action since we don't have a post detail screen
    console.log('Comment on post:', postId);
  };

  const handleSharePost = (postId: string) => {
    // Share functionality would go here
    console.log('Share post:', postId);
  };

  const handleCreatePost = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please log in to create posts.');
      return;
    }

    if (newPostText.trim()) {
      try {
        setPosting(true);

        const postData = {
          userId: user.uid,
          userName: user.displayName || 'Anonymous',
          userAvatar:
            user.photoURL ||
            'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          content: newPostText,
          images: [],
          likes: {},
          comments: 0,
        };

        await createPost(postData);
        setNewPostText('');

        // Reload posts to show the new one
        await loadPosts();

        Alert.alert('Success', 'Post created successfully!');
      } catch (error) {
        console.error('Failed to create post:', error);
        Alert.alert('Error', 'Failed to create post. Please try again.');
      } finally {
        setPosting(false);
      }
    }
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={() => handleLikePost(item.id)}
      onComment={() => handlePostComment(item.id)}
      onShare={() => handleSharePost(item.id)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Community" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Community" />

      <View style={styles.createPostContainer}>
        <Image
          source={{
            uri:
              user?.photoURL ||
              'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          }}
          style={styles.userAvatar}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.postInput}
            placeholder="Share your travel experiences..."
            placeholderTextColor={Colors.gray[500]}
            multiline
            value={newPostText}
            onChangeText={setNewPostText}
            editable={!posting}
          />
          <TouchableOpacity
            style={[
              styles.postButton,
              (!newPostText.trim() || posting) && styles.disabledPostButton,
            ]}
            onPress={handleCreatePost}
            disabled={!newPostText.trim() || posting}
          >
            {posting ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Send size={18} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadPosts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginTop: 12,
  },
  createPostContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: Colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[800],
    minHeight: 24,
    maxHeight: 80,
  },
  postButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledPostButton: {
    backgroundColor: Colors.gray[400],
  },
  postsList: {
    paddingBottom: 100,
  },
});
