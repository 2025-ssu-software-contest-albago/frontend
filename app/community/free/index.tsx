import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post, usePostContext } from '../contexts/PostContext';

export default function FreeBoardScreen() {
  const { posts, likePost } = usePostContext();
  const router = useRouter();

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
          onPress={(e) => {
            e.stopPropagation();
            handleLike(item.id, e);
          }}
        >
          <AntDesign
            name="like1"
            size={18}
            color={item.likes >= 1 ? '#1976d2' : '#888'}
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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
      />
      
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
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 150 : 100,
    right: 25,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#1976d2', // 배경색 추가 (누락되어 있었음)
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
});