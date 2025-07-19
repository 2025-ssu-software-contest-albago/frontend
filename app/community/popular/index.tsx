import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post, usePostContext } from '../contexts/PostContext';

export default function PopularBoardScreen() {
  const { likePost, getPopularPosts } = usePostContext();
  const router = useRouter();
  const MIN_LIKES_FOR_POPULAR = 10;
  
  // 인기글만 가져오기 (좋아요 10개 이상)
  const popularPosts = getPopularPosts(MIN_LIKES_FOR_POPULAR);

  const handleLike = (id: string, event: any) => {
    // 이벤트 버블링 방지
    event.stopPropagation();
    likePost(id);
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
          onPress={(e) => handleLike(item.id, e)}
        >
          <AntDesign
            name="like1"
            size={18}
            color="#1976d2" // 인기글은 모두 좋아요가 많으니 항상 파란색
          />
          <Text style={styles.count}>{item.likes}</Text>
        </TouchableOpacity>
        <View style={styles.iconRow}>
          <AntDesign name="message1" size={18} color="#888" />
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