import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function EditPostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // 실제 구현에서는 ID를 기반으로 서버에서 게시글 데이터를 가져와야 함
  const [title, setTitle] = useState('첫 번째 자유글');
  const [content, setContent] = useState('자유롭게 의견을 나눠보세요!');

  const handleSubmit = () => {
    // 제목이나 내용이 비어있는지 확인
    if (!title.trim() || !content.trim()) {
      Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 실제 구현에서는 서버에 수정 요청을 보내야 함
    Alert.alert('성공', '게시글이 수정되었습니다.', [
      {
        text: '확인',
        onPress: () => router.back()
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글 수정</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        {/* 제목 입력 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>
        
        {/* 구분선 */}
        <View style={styles.divider} />
        
        {/* 내용 입력 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.contentInput}
            placeholder="내용을 입력하세요"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
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
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  contentInput: {
    fontSize: 15,
    color: '#333',
    minHeight: 300,
    lineHeight: 22,
  },
});