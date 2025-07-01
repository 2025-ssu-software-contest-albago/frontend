import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import { Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

//zustand 전역변수 관리 
import { useUserStore } from '@/scripts/store/userStore';



export default function TopBar() {
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter(); // 추가

    // ✅ Zustand에서 유저 정보 사용
    const user = useUserStore((state) => state.user);
    return (
        <View style={styles.container}>
            {/* 왼쪽 영역 */}
            <View style={styles.leftSection}>
                {user?.spaces[0]?.imageUrl === "null" ? (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
                    </View>
                ) : (
                    <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
                )}
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.nameRow}>
                        <Text style={styles.name}>{user?.spaces[0]?.name}</Text>
                        <Ionicons name="chevron-down" size={16} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
            </View>

            {/* 오른쪽 아이콘 */}
            <View style={styles.rightSection}>
                <Pressable onPress={() => router.push('/notification')}>
                    <Feather name="bell" size={20} color="#333" style={styles.icon} />
                </Pressable>
                <Pressable onPress={() => router.push('/appSettings')}>
                    <Feather name="sliders" size={20} color="#333" />
                </Pressable>
            </View>

            {/* 모달 */}
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.4}
                style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>공간 전환</Text>
                    <Pressable><Text style={styles.modalItem}>팀 공간 1</Text></Pressable>
                    <Pressable><Text style={styles.modalItem}>팀 공간 2</Text></Pressable>
                    <Pressable><Text style={styles.modalItem}>+ 새 공간 만들기</Text></Pressable>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginTop: 20
        // backgroundColor: 'white',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    userInfo: {
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 4,
    },
    email: {
        fontSize: 12,
        color: '#888',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    modalContainer: {
        justifyContent: 'flex-end', // ✅ 아래서부터 올라오게
        margin: 0, // ✅ 기본 margin 제거 (화면 끝까지)
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 12,
    },
    modalItem: {
        paddingVertical: 8,
        fontSize: 14,
    },
});