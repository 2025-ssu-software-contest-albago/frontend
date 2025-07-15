import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemoStore } from '@/scripts/store/useMemoStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import dayjs from 'dayjs';

export default function MemoDetail() {
    const { noteId } = useLocalSearchParams();
    const findNoteById = useMemoStore(state => state.findNoteById);
    const note = findNoteById(noteId);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    if (!note) {
        return (
            <View style={styles.centered}>
                <Text>메모를 찾을 수 없습니다.</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, {marginTop: insets.top}]}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>메모 상세</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* 메모 내용 */}
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.date}>
                작성일: {dayjs(note.createdAt).format('YYYY.MM.DD HH:mm')}
            </Text>

            <Text style={styles.content}>{note.content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222'
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginBottom: 20,
    },
    content: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24
    },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
