import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { format } from 'date-fns';
import { useCalTypeStore } from '@/scripts/store/personalStore';

const { height: screenHeight } = Dimensions.get('window');

interface ScheduleItem {
    id: string;
    name: string;
    startTime: string; // ISO string or similar
    endTime: string;   // ISO string or similar
    price: number;
    color?: string; // Optional color for the left bar
}

interface DailyScheduleModalContentProps { // 이름을 변경하여 이것이 모달 콘텐츠임을 명확히 합니다.
    selectedDate: Date | null;
    dailySchedules: ScheduleItem[];
    onAddSchedule: (date: Date) => void;
    onClose: () => void; // 닫기 버튼을 위해 추가. onBackdropPress는 외부 Modal에서 처리.
}

const DailyScheduleModalContent: React.FC<DailyScheduleModalContentProps> = ({
    selectedDate,
    dailySchedules,
    onAddSchedule,
    onClose
}) => {
    if (!selectedDate) {
        return null; // selectedDate가 없으면 렌더링하지 않음
    }

    const formattedDate = format(selectedDate, 'M월 d일');
    const setCalType = useCalTypeStore((state) => state.setCalType);

    return (
        // 이 View가 react-native-modal의 Modal 컴포넌트의 자식으로 들어갈 것입니다.
        <View style={modalStyles.modalContainer}>
            {/* 닫기 버튼 */}
            <Pressable onPress={onClose} style={modalStyles.closeButton}>
                <Text style={modalStyles.closeButtonText}>X</Text>
            </Pressable>

            <Text style={modalStyles.modalDate}>{formattedDate}</Text>

            <ScrollView style={modalStyles.scheduleList}>
                {dailySchedules.length > 0 ? (
                    dailySchedules.map((schedule) => {
                        const startTime = format(new Date(schedule.startTime), 'HH:mm');
                        const endTime = format(new Date(schedule.endTime), 'HH:mm');
                        const durationMs = new Date(schedule.endTime).getTime() - new Date(schedule.startTime).getTime();
                        const durationHours = durationMs / (1000 * 60 * 60);

                        return (
                            <View key={schedule.id} style={modalStyles.scheduleItem}>
                                <View style={[modalStyles.scheduleColorBar, { backgroundColor: schedule.color || '#ccc' }]} />
                                <View style={modalStyles.scheduleDetails}>
                                    <Text style={modalStyles.scheduleName}>{schedule.name}</Text>
                                    <Text style={modalStyles.schedulePrice}>
                                        {schedule.price?.toLocaleString() || '0'}원
                                    </Text>
                                </View>
                                <View style={modalStyles.scheduleTime}>
                                    <Text style={modalStyles.scheduleTimeRange}>{startTime} - {endTime}</Text>
                                    <Text style={modalStyles.scheduleDuration}>{durationHours}시간</Text>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <Text style={modalStyles.noScheduleText}>이 날짜에는 일정이 없습니다.</Text>
                )}
            </ScrollView>

            <Pressable
                style={modalStyles.addScheduleButton}
                onPress={() => setCalType("편집")}
            >
                <Text style={modalStyles.addScheduleButtonText}>일정 추가하기</Text>
            </Pressable>
        </View>
    );
};

const modalStyles = StyleSheet.create({
    // bottomModal 스타일은 이제 PersonalMonth에서 Modal 컴포넌트에 직접 적용됩니다.
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%', // PersonalMonth의 Modal이 flex:1로 전체 영역을 차지할 것이므로, 내부는 100%
        maxHeight: screenHeight * 0.75,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 20,
        padding: 5,
        zIndex: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#666',
        fontWeight: 'bold',
    },
    modalDate: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    scheduleList: {
        maxHeight: screenHeight * 0.45,
        marginBottom: 20,
    },
    scheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    scheduleColorBar: {
        width: 6,
        height: '100%',
        borderRadius: 3,
        marginRight: 10,
    },
    scheduleDetails: {
        flex: 1,
    },
    scheduleName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    schedulePrice: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    scheduleTime: {
        alignItems: 'flex-end',
    },
    scheduleTimeRange: {
        fontSize: 15,
        fontWeight: '500',
        color: '#555',
    },
    scheduleDuration: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    noScheduleText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        fontSize: 16,
    },
    addScheduleButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    addScheduleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DailyScheduleModalContent; // 이름도 변경하여 혼동 방지