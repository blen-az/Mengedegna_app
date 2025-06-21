import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ThumbsUp, MessageCircle, Share2, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Post } from '@/types/Post';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

const { width } = Dimensions.get('window');

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Format date as relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  };

  // Handle content that might be too long
  const shouldTruncate = post.content.length > 150;
  const displayContent = shouldTruncate && !expanded 
    ? post.content.slice(0, 150) + '...' 
    : post.content;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: post.user.avatar }} 
          style={styles.avatar} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.timestamp}>{getRelativeTime(post.timestamp)}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color={Colors.gray[600]} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>
          {displayContent}
        </Text>
        
        {shouldTruncate && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMore}>
              {expanded ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {post.images && post.images.length > 0 && (
        <View style={styles.imageContainer}>
          {post.images.length === 1 ? (
            <Image 
              source={{ uri: post.images[0] }} 
              style={styles.singleImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.multipleImages}>
              {post.images.slice(0, 4).map((image, index) => (
                <Image 
                  key={index} 
                  source={{ uri: image }} 
                  style={[
                    styles.gridImage,
                    post.images!.length === 3 && index === 0 && styles.largeGridImage,
                  ]} 
                  resizeMode="cover"
                />
              ))}
              {post.images.length > 4 && (
                <View style={styles.moreImagesOverlay}>
                  <Text style={styles.moreImagesText}>+{post.images.length - 4}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      <View style={styles.stats}>
        <View style={styles.likesComments}>
          <Text style={styles.statsText}>
            {post.likes} {post.likes === 1 ? 'like' : 'likes'}
          </Text>
          <Text style={styles.statsText}>
            {post.comments} {post.comments === 1 ? 'comment' : 'comments'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onLike}
        >
          <ThumbsUp 
            size={20} 
            color={post.liked ? Colors.primary : Colors.gray[600]}
            fill={post.liked ? Colors.primary : 'transparent'}
          />
          <Text 
            style={[
              styles.actionText,
              post.liked && styles.activeActionText
            ]}
          >
            Like
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onComment}
        >
          <MessageCircle size={20} color={Colors.gray[600]} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onShare}
        >
          <Share2 size={20} color={Colors.gray[600]} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[900],
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  moreButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  contentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
    lineHeight: 20,
  },
  readMore: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
    marginTop: 4,
  },
  imageContainer: {
    width: '100%',
    marginBottom: 12,
  },
  singleImage: {
    width: '100%',
    height: 200,
  },
  multipleImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridImage: {
    width: width / 2 - 12,
    height: 120,
    margin: 2,
  },
  largeGridImage: {
    width: width - 24,
    height: 200,
  },
  moreImagesOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: width / 2 - 12,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  stats: {
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray[200],
  },
  likesComments: {
    flexDirection: 'row',
  },
  statsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginRight: 16,
  },
  actions: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
    marginLeft: 6,
  },
  activeActionText: {
    color: Colors.primary,
  },
});