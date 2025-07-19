import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post, usePostContext } from '../contexts/PostContext';

export default function FreeBoardScreen() {
  const { posts, togglePostLike } = usePostContext();
  const router = useRouter();
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
        pathname: '/community/free/[id]',
        params: { id: item.id }
      })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.iconRow}
          onPress={(e) => {
            e.stopPropagation();
            handleLike(item.id, e);
          }}
        >
          <AntDesign
            name={likedPosts[item.id] ? "heart" : "hearto"} // 활성화 시 채워진 하트, 비활성화 시 빈 하트
            size={18}
            color="#e53935" // 항상 빨간색
          />
          <Text style={styles.count}>{item.likes}</Text>
        </TouchableOpacity>
        <View style={styles.iconRow}>
          <AntDesign name="message1" size={18} color="#3f51b5" /> {/* 댓글 아이콘 색상을 파란보라색으로 변경 */}
          <Text style={styles.count}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>게시글이 없습니다.</Text>
          <Text style={styles.emptySubText}>첫 게시글을 작성해보세요!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
        />
      )}
      
      {/* 글쓰기 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/community/free/write')}
      >
        <AntDesign name="pluscircleo" size={24} color="#fff" />
      </TouchableOpacity>
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
  // 좋아요 활성화 시 사용할 스타일
  likeCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#e53935',
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 150 : 100,
    right: 25,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  emptySubText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  commentDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
});