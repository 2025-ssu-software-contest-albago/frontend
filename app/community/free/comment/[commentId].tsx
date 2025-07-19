import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePostContext } from '../../contexts/PostContext';

// 댓글 수정 화면
export default function EditCommentScreen() {
  const router = useRouter();
  const { commentId, postId } = useLocalSearchParams();
  const { getCommentById, updateComment, deleteComment } = usePostContext();

  // 현재 댓글 데이터 가져오기 (실제로는 Context API를 통해)
  const currentComment = getCommentById?.(commentId as string) || {
    id: commentId as string,
    postId: postId as string,
    content: '',
    author: '사용자',
    createdAt: new Date().toISOString(),
  };

  const [content, setContent] = useState(currentComment.content);

  // 수정 완료
  const handleSubmit = () => {
    if (!content.trim()) {
      Alert.alert('오류', '댓글 내용을 입력해주세요.');
      return;
    }

    if (updateComment) {
      updateComment(commentId as string, content);
      
      Alert.alert('완료', '댓글이 수정되었습니다.', [
        { text: '확인', onPress: () => router.back() }
      ]);
    } else {
      // Context API가 없는 경우를 위한 임시 처리
      Alert.alert('알림', '댓글 기능 구현 중입니다.', [
        { text: '확인', onPress: () => router.back() }
      ]);
    }
  };

  // 댓글 삭제
  const handleDelete = () => {
    Alert.alert(
      '댓글 삭제',
      '정말로 이 댓글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            if (deleteComment) {
              deleteComment(commentId as string);
              Alert.alert('삭제됨', '댓글이 삭제되었습니다.', [
                { text: '확인', onPress: () => router.back() }
              ]);
            } else {
              // Context API가 없는 경우를 위한 임시 처리
              Alert.alert('알림', '댓글 기능 구현 중입니다.', [
                { text: '확인', onPress: () => router.back() }
              ]);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>댓글 수정</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>완료</Text>
        </TouchableOpacity>
      </View>

      {/* 댓글 수정 폼 */}
      <View style={styles.formContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.author}>{currentComment.author}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>삭제</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.commentInput}
          placeholder="댓글 내용을 입력하세요"
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  submitButton: {
    padding: 5,
  },
  submitText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  author: {
    fontWeight: '600',
    color: '#333',
    fontSize: 15,
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    color: '#f44336',
    fontSize: 14,
  },
  commentInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#333',
  },
});