import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddHandover() {
  const { tabId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    // trim() 으로 공백도 제거해서 빈문자열 방지
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newNote = {
      id: Date.now().toString(), // 임시 id
      tabId,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('🚀 새 메모:', newNote);

    // 이후 router.back() 등으로 뒤로가기 가능
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>인수 인계</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 입력 폼 */}
      <TextInput
        style={styles.titleInput}
        placeholder="제목을 입력해주세요"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.contentInput}
        placeholder="내용을 입력해주세요"
        placeholderTextColor="#aaa"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* 하단 액션 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.doneText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  contentInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlignVertical: 'top',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  doneText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  }
});
