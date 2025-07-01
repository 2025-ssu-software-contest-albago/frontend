import React, { useState } from 'react';
import Modal from 'react-native-modal';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const timeLabelWidth = 20;
const horizontalPadding = 20;
const cellWidth = (SCREEN_WIDTH - timeLabelWidth - horizontalPadding) / 7;

export default function WeekEdit() {
    const [selectedSpace, setSelectedSpace] = useState('스쿨피자');
    const [spaceModalVisible, setSpaceModalVisible] = useState(false);
    const [spaces] = useState(['스쿨피자', '맥도날드', '투썸', '스터디룸A']);

    const hours = Array.from({ length: 48 }, (_, i) => i * 0.5); // 0 ~ 23.5

    return (
        <View style={styles.container}>
            {/* 날짜 범위 */}
            <Text style={styles.dateRange}>6.22 - 6.28</Text>

            {/* 요일 헤더 */}
            <View style={styles.dayHeader}>
                <View style={{ width: timeLabelWidth }} /> {/* 시간 라벨 칸 */}
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <Text key={i} style={[styles.dayText, { width: cellWidth }]}>
                        {day}
                    </Text>
                ))}
            </View>

            {/* 시간표 스크롤 영역 */}
            <ScrollView contentContainerStyle={styles.scheduleGrid}>
                {hours.map((halfHour, rowIdx) => {
                    const isHour = Number.isInteger(halfHour);
                    const hourText = isHour
                        ? String(halfHour).padStart(2, '0')
                        : '';
                    return (
                        <View key={rowIdx} style={[styles.row, isHour && styles.hourLine]}>
                            <Text style={styles.timeLabel}>{hourText}</Text>
                            {[...Array(7)].map((_, colIdx) => (
                                <TouchableOpacity
                                    key={colIdx}
                                    style={[
                                        styles.cell,
                                        { width: cellWidth, height: 30 },
                                        colIdx === 6 && { borderRightWidth: 0 }, // 토요일 오른쪽 선 제거
                                    ]}
                                />
                            ))}
                        </View>
                    );
                })}
            </ScrollView>

            {/* 공간 선택 드롭다운 */}
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setSpaceModalVisible(true)}
            >
                <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownText}>{selectedSpace}</Text>
                    <Ionicons name="chevron-down" size={18} color="#555" />
                </View>
            </TouchableOpacity>

            {/* 저장 버튼 */}
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveText}>저장 하기</Text>
            </TouchableOpacity>

            {/* 모달: 공간 선택 */}
            <Modal
                isVisible={spaceModalVisible}
                onBackdropPress={() => setSpaceModalVisible(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.4}
                style={{ margin: 0, justifyContent: 'flex-end' }}>

                <View style={styles.modalContent}>
                    {spaces.map((space, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setSelectedSpace(space);
                                setSpaceModalVisible(false);
                            }}
                            style={styles.modalItem}
                        >
                            <Text>{space}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 40, backgroundColor: '#fff' },
    dateRange: { fontSize: 18, textAlign: 'center', marginBottom: 10 },

    dayHeader: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        marginBottom: 5,
    },
    dayText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },

    scheduleGrid: {
        paddingHorizontal: 10,
        paddingBottom: 30,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
    },
    hourLine: {
        borderTopWidth: 0.2,
        borderTopColor: '#ccc',
    },
    timeLabel: {
        width: timeLabelWidth,
        textAlign: 'center',
        fontSize: 12,
        color: '#555',
    },
    cell: {
        borderTopWidth: 0.2,
        borderLeftWidth: 0.2,
        borderBottomWidth: 0.2,
        borderRightWidth: 0.2,
        borderColor: '#ccc',
    },
    dropdown: {
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
    },

    dropdownContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dropdownText: {
        fontSize: 14,
        color: '#000',
    },
    saveButton: {
        backgroundColor: '#3399ff',
        padding: 12,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 6,
    },
    saveText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    modalItem: {
        paddingVertical: 10,
    },
});
