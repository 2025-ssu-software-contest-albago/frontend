// app/personal/(detail)/scheduleDetail.tsx (또는 ScheduleDetail.tsx)
import { scheduleColors } from '@/scripts/color/scheduleColor';
import { useUserStore } from '@/scripts/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale'; // <--- 한글 locale 임포트
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

interface ScheduleItem {
    id: string;
    name: string;
    startTime: string; // ISO string or similar
    endTime: string;    // ISO string or similar
    color?: string; // Optional color for the left bar
    hourlyWage?: number; // ScheduleDetail에서 필요한 경우
    memo?: string;       // ScheduleDetail에서 필요한 경우
}

const PersonalScheduleDetail: React.FC = () => {
    const searchParams = useLocalSearchParams();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [schedule, setSchedule] = useState<ScheduleItem | null>(null);
    const user = useUserStore((state) => state.user);
    const selected_space = useUserStore((state) => state.selected_space);
    const space_type = user?.spaces[selected_space]?.type;

    // 출근 시간 수정 관련 상태
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
    const [checkInTime, setCheckInTime] = useState<Date | null>(null);
    const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);

    useEffect(() => {
        if (searchParams.schedule) {
            try {
                const parsedSchedule: ScheduleItem = JSON.parse(decodeURIComponent(searchParams.schedule as string));
                setSchedule(parsedSchedule);
            } catch (error) {
                console.error("Failed to parse schedule param:", error);
                setSchedule(null);
            }
        } else {
            setSchedule(null);
        }
    }, [searchParams.schedule]);

    const isValidDate = (d: Date | null | undefined) => d instanceof Date && !isNaN(d.getTime());

    if (!schedule) {
        return (
            <View style={[styles.container, { marginTop: insets.top }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.closeButtonTop}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.errorText}>스케줄 정보를 불러올 수 없습니다. 이전 화면으로 돌아가주세요.</Text>
            </View>
        );
    }

    const startDateTime = schedule.startTime ? new Date(schedule.startTime) : null;
    const endDateTime = schedule.endTime ? new Date(schedule.endTime) : null;

    // 출근/퇴근 시간 표시용 (수정된 값이 있으면 그 값, 아니면 원래 값)
    const displayCheckIn = checkInTime || startDateTime;
    const displayCheckOut = checkOutTime || endDateTime;

    const formattedDate = isValidDate(startDateTime) ? format(startDateTime as Date, 'yyyy년 M월 d일 (EEE)', { locale: ko }) : '날짜 정보 없음';
    const formattedTimeRange =
        (displayCheckIn && isValidDate(displayCheckIn) ? format(displayCheckIn, 'HH:mm') : '--:--') +
        ' - ' +
        (displayCheckOut && isValidDate(displayCheckOut) ? format(displayCheckOut, 'HH:mm') : '--:--');

    const durationMs = (displayCheckIn && displayCheckOut && isValidDate(displayCheckIn) && isValidDate(displayCheckOut))
        ? displayCheckOut.getTime() - displayCheckIn.getTime()
        : 0;
    const durationHours = durationMs / (1000 * 60 * 60);
    const displayDuration = Number.isInteger(durationHours)
        ? durationHours.toString()
        : durationHours.toFixed(1);

    // hourlyWage가 있을 때만 totalPrice 계산
    const totalPrice = (schedule.hourlyWage && durationHours > 0)
        ? Math.floor(schedule.hourlyWage * durationHours) // 소수점 아래는 버림 (또는 반올림, 올림 선택)
        : 0; // 시급이 없거나 시간이 0이면 0원

    // 출근 상태 판별 함수 추가
    const getAttendanceStatus = (start: Date | null, checkIn: Date | null, checkOut?: Date | null) => {
        if (!checkIn) return { label: '미출근', color: '#bbb' }; // 회색
        if (!start) return { label: '정보없음', color: '#bbb' };

        // 예시: 9시 이전 출근이면 정상, 9시~9시30분이면 지각, 9시30분 이후면 결근
        const startHour = start.getHours();
        const startMinute = start.getMinutes();
        const checkInHour = checkIn.getHours();
        const checkInMinute = checkIn.getMinutes();

        // 출근 기준 시간 (예: 9:00)
        const baseHour = 9;
        const baseMinute = 0;

        // 지각 기준 시간 (예: 9:30)
        const lateHour = 9;
        const lateMinute = 30;

        // 퇴근 시간이 없고 출근 시간이 있으면 근무중
        if (checkIn && !checkOut) {
            return { label: '근무중', color: '#1976d2' }; // 파란색
        }

        // checkIn이 출근 기준 이전이면 정상
        if (
            checkInHour < baseHour ||
            (checkInHour === baseHour && checkInMinute <= baseMinute)
        ) {
            return { label: '정상출근', color: '#3CB371' }; // 녹색
        }
        // checkIn이 지각 기준 이전이면 지각
        if (
            (checkInHour === baseHour && checkInMinute > baseMinute) ||
            (checkInHour === lateHour && checkInMinute <= lateMinute)
        ) {
            return { label: '지각', color: '#FFD600' }; // 노란색
        }
        // 그 외는 결근
        return { label: '결근', color: '#E74C3C' }; // 빨간색
    };

    // 예시: 실제 출근 시간(출근 버튼 누른 시간) - 실제 구현에서는 DB에서 받아와야 함
    // const checkInTime: Date | null = null; // 예: new Date('2025-08-03T09:05:00') 등
    const attendanceStatus = getAttendanceStatus(startDateTime, displayCheckIn, checkOutTime);

    // 출근 시간 변경 핸들러
    const onChangeCheckIn = (event: any, selectedDate?: Date) => {
        setShowCheckInPicker(false);
        if (selectedDate) setCheckInTime(selectedDate);
    };
    // 퇴근 시간 변경 핸들러
    const onChangeCheckOut = (event: any, selectedDate?: Date) => {
        setShowCheckOutPicker(false);
        if (selectedDate) setCheckOutTime(selectedDate);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerDate}>{formattedDate}</Text>
                <View style={styles.backButtonPlaceholder} />
            </View>

            <View style={styles.workplaceSection}>
                <View style={[styles.workplaceColorBar, { backgroundColor: scheduleColors[schedule.color]?.main || '#ccc' }]} />
                <Text style={styles.workplaceName}>{schedule.name || '알 수 없는 근무지'}</Text>
            </View>

            <View style={styles.timeSection}>
                <Text style={styles.timeRange}>{formattedTimeRange}</Text>
                <Text style={styles.durationText}>{displayDuration}시간</Text>
                {/* 출근 상태 표시 */}
                <View style={[styles.attendanceStatus, { backgroundColor: attendanceStatus.color }]}>
                    <Text style={styles.attendanceStatusText}>{attendanceStatus.label}</Text>
                </View>
                {/* 출근 시간 수정 버튼 */}
                <Pressable
                    style={styles.editTimeButton}
                    onPress={() => setShowCheckInPicker(true)}
                >
                    <Ionicons name="time-outline" size={18} color="#1976d2" />
                    <Text style={styles.editTimeButtonText}>출근 수정</Text>
                </Pressable>
                {/* 퇴근 시간 수정 버튼 */}
                <Pressable
                    style={styles.editTimeButton}
                    onPress={() => setShowCheckOutPicker(true)}
                >
                    <Ionicons name="time-outline" size={18} color="#1976d2" />
                    <Text style={styles.editTimeButtonText}>퇴근 수정</Text>
                </Pressable>
            </View>

            {/* 출근 시간 선택 다이얼로그 */}
            {showCheckInPicker && (
                <DateTimePicker
                    value={displayCheckIn || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeCheckIn}
                />
            )}
            {/* 퇴근 시간 선택 다이얼로그 */}
            {showCheckOutPicker && (
                <DateTimePicker
                    value={displayCheckOut || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeCheckOut}
                />
            )}

            <Pressable style={[styles.requestShiftButton, space_type === 'personal' ? { backgroundColor: '#ccc' } : { backgroundColor: '#FFEE58',}]} 
                disabled={space_type === 'personal'} 
                onPress={() => console.log('근무 교대 요청')}
            >
                <Text style={styles.requestShiftButtonText}>근무 교대 요청하기</Text>
            </Pressable>

            <View style={styles.financeSection}>

                <View style={styles.financeItem}>
                    <Text style={styles.financeLabel}>총액</Text>
                    <Text style={styles.financeValue}>{totalPrice.toLocaleString()}원</Text>
                </View>

                <View style={styles.financeItem}>
                    <Text style={styles.financeLabel}>시급</Text>
                    <Text style={styles.financeValue}>{typeof schedule.hourlyWage === 'number' ? schedule.hourlyWage.toLocaleString() : '0'}원</Text>
                </View>
            </View>

            <View style={styles.memoSection}>
                <View style={styles.memoHeader}>
                    <Text style={styles.memoTitle}>메모</Text>
                    <Pressable onPress={() => console.log('메모 편집')}>
                        <Ionicons name="pencil" size={18} color="#666" />
                    </Pressable>
                </View>
                <Text style={styles.memoContent}>
                    {schedule.memo && schedule.memo.trim() !== '' ? schedule.memo : '추가한 메모가 없습니다.'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 20,
    },
    backButton: {
        padding: 5,
    },
    headerDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    backButtonPlaceholder: {
        width: 34,
    },
    workplaceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    workplaceColorBar: {
        width: 8,
        height: 35,
        borderRadius: 4,
        marginRight: 10,
        marginTop: 5, // 상단 정렬을 위해 약간의 여백 추가
    },
    workplaceName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    timeSection: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    timeRange: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginRight: 8,
    },
    durationText: {
        fontSize: 16,
        color: '#666',
    },
    requestShiftButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    requestShiftButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    financeSection: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    financeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    financeLabel: {
        fontSize: 16,
        color: '#666',
    },
    financeValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    memoSection: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    memoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    memoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    memoContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    closeButtonTop: {
        position: 'absolute',
        top: 60,
        left: 20,
        padding: 5,
        zIndex: 10,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
        marginTop: 100,
        paddingHorizontal: 20,
    },
    attendanceStatus: {
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'center',
    },
    attendanceStatusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    editTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#e3f0ff',
    },
    editTimeButtonText: {
        color: '#1976d2',
        fontWeight: 'bold',
        fontSize: 11,
        marginLeft: 3,
    },
});

export default PersonalScheduleDetail;