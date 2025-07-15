import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHandOverStore } from '@/scripts/store/handoverStore';
import { Ionicons } from '@expo/vector-icons';

export default function NoteDetail() {
  const router = useRouter();
  const { noteId, tabId } = useLocalSearchParams();
  const findNoteById = useHandOverStore(state => state.findNoteById);
  const note = findNoteById(tabId, noteId);
  
  const insets = useSafeAreaInsets();

  if (!note) {
    return (
      <View style={styles.centered}>
        <Text>메모를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>인수 인계</Text>
        <TouchableOpacity onPress={() => console.log("수정 클릭")}>
          <Text style={styles.editText}>수정</Text>
        </TouchableOpacity>
      </View>

      {/* 본문 */}
      <ScrollView style={{ marginTop: 24 }}>
        <Text style={styles.title}>{note.title}</Text>

        <Text style={styles.label}>내용</Text>
        <Text style={styles.content}>{note.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555'
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444'
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
