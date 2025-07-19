import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post, usePostContext } from '../contexts/PostContext';

export default function PopularBoardScreen() {
  const { getPopularPosts, togglePostLike } = usePostContext();
  const router = useRouter();
  const MIN_LIKES_FOR_POPULAR = 10;
  
  // 인기글만 가져오기 (좋아요 10개 이상)
  const popularPosts = getPopularPosts(MIN_LIKES_FOR_POPULAR);
  
  // 게시글별 좋아요 상태를 저장하는 상태 추가
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, event: any) => {
    // 이벤트 버블링 방지
    event.stopPropagation();
    
    // 현재 좋아요 상태 확인 및 토글
    const currentLiked = likedPosts[id] || false;
    const newLikedState = !currentLiked;
    
    // 좋아요 상태 업데이트
    setLikedPosts(prev => ({
      ...prev,
      [id]: newLikedState
    }));
    
    // Context를 통해 좋아요 수 업데이트
    togglePostLike(id, newLikedState);
  };

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        // 경로를 popular로 변경
        pathname: '/community/popular/[id]',
        params: { id: item.id }
      })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.iconRow}
          onPress={(e) => handleLike(item.id, e)}
        >
          <AntDesign
            name={likedPosts[item.id] ? "heart" : "hearto"}
            size={18}
            color="#e53935"
          />
          <Text style={styles.count}>{item.likes}</Text>
        </TouchableOpacity>
        <View style={styles.iconRow}>
          <AntDesign name="message1" size={18} color="#3f51b5" />
          <Text style={styles.count}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {popularPosts.length > 0 ? (
        <FlatList
          data={popularPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>인기글이 없습니다.</Text>
          <Text style={styles.emptySubText}>자유게시판에서 좋아요 {MIN_LIKES_FOR_POPULAR}개 이상 받은 글이 이곳에 표시됩니다.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  content: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  count: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
  commentCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  // 좋아요 활성화 시 사용할 스타일
  likeCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#e53935',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  }
});