import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePostContext } from '../../contexts/PostContext';

export default function AddCommentScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const { addComment } = usePostContext();
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) {
      Alert.alert('오류', '댓글 내용을 입력해주세요.');
      return;
    }

    if (addComment) {
      // Context API를 통해 댓글 추가
      addComment(postId as string, comment);
      
      Alert.alert('완료', '댓글이 등록되었습니다.', [
        { text: '확인', onPress: () => router.back() }
      ]);
    } else {
      // Context API가 없는 경우를 위한 임시 처리
      Alert.alert('알림', '댓글 기능 구현 중입니다.', [
        { text: '확인', onPress: () => router.back() }
      ]);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>댓글 작성</Text>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={[styles.submitButton, !comment.trim() && styles.disabledButton]}
          disabled={!comment.trim()}
        >
          <Text style={[styles.submitText, !comment.trim() && styles.disabledText]}>등록</Text>
        </TouchableOpacity>
      </View>

      {/* 댓글 입력 폼 */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 작성해주세요..."
          value={comment}
          onChangeText={setComment}
          multiline
          autoFocus
          textAlignVertical="top"
        />
        
        {/* 가이드라인 텍스트 */}
        <Text style={styles.guideText}>
          * 타인에게 불쾌감을 주는 욕설, 비방, 차별적 발언 등은 제재 대상이 될 수 있습니다.
        </Text>
      </View>
    </KeyboardAvoidingView>
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
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  commentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  guideText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
});