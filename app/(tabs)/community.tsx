import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ThumbsUp, MessageCircle, Share, Send } from 'lucide-react-native';
import SafeAreaView from '@/components/core/SafeAreaView';
import Header from '@/components/core/Header';
import PostCard from '@/components/custom/PostCard';
import { communityPosts } from '@/data/mockData';
import Colors from '@/constants/Colors';
import { Post } from '@/types/Post';

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(communityPosts);
  const [newPostText, setNewPostText] = useState('');

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } 
          : post
      )
    );
  };

  const handlePostComment = (postId: string) => {
    // For now, just log the action since we don't have a post detail screen
    console.log('Comment on post:', postId);
  };

  const handleSharePost = (postId: string) => {
    // Share functionality would go here
    console.log('Share post:', postId);
  };

  const handleCreatePost = () => {
    if (newPostText.trim()) {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        user: {
          id: 'current-user',
          name: 'You',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        },
        content: newPostText,
        images: [],
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        liked: false,
      };

      setPosts([newPost, ...posts]);
      setNewPostText('');
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Community" />
      
      <View style={styles.createPostContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }} 
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
          />
          <TouchableOpacity 
            style={[
              styles.postButton,
              !newPostText.trim() && styles.disabledPostButton
            ]} 
            onPress={handleCreatePost}
            disabled={!newPostText.trim()}
          >
            <Send size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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