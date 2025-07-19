import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PopularPostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // 실제 구현에서는 id를 기반으로 서버에서 데이터 가져오기
  const dummyPost = {
    id: id as string,
    title: '인기 게시글 상세',
    content: '여기에 게시글 내용이 표시됩니다.',
    date: '2025-07-15',
    likes: 15,
    comments: 8,
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.title}>{dummyPost.title}</Text>
        <Text style={styles.date}>{dummyPost.date}</Text>
        <View style={styles.divider} />
        <Text style={styles.content}>{dummyPost.content}</Text>
        
        {/* 좋아요 & 댓글 카운트 */}
        <View style={styles.actionRow}>
          <View style={styles.iconRow}>
            <AntDesign name="like1" size={18} color="#1976d2" />
            <Text style={styles.count}>{dummyPost.likes}</Text>
          </View>
          <View style={styles.iconRow}>
            <AntDesign name="message1" size={18} color="#888" />
            <Text style={styles.count}>{dummyPost.comments}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
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
});