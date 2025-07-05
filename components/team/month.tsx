import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, InteractionManager, Pressable } from 'react-native';
import PagerView from 'react-native-pager-view';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
} from 'date-fns';

import { useUserStore } from '@/scripts/store/userStore';
import { useEditDateStore } from '@/scripts/store/teamStore';
import { userData } from '@/scripts/dummyData/userData';
import DailyScheduleModalContent from '../team/DailyScheduleModal'; // import 이름 변경
import Modal from 'react-native-modal'; // react-native-modal import는 그대로 유지

// --- MonthCalendarView 컴포넌트 시작 (React.memo로 감싸서 최적화) ---
const MonthCalendarView = React.memo(({
    targetMonth,
    calendarWidth,
    allUserSchedules,
    selectedSpaceIndex,
    WEEK_DAYS,
    currentMonthNumRows,
    styles,
    onDatePress
}) => {
    const getMonthDays = (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const days = eachDayOfInterval({ start, end });
        const prefix = Array(start.getDay()).fill(null);
        return [...prefix, ...days];
    };

    const monthSchedulesMap = useMemo(() => {
        if (selectedSpaceIndex == null || !allUserSchedules[selectedSpaceIndex] || allUserSchedules[selectedSpaceIndex]?.type === "personal") return {};

        const schedules = allUserSchedules[selectedSpaceIndex].schedules || [];
        const monthStart = startOfMonth(targetMonth);
        const monthEnd = endOfMonth(targetMonth);

        return schedules.reduce((acc, schedule) => {
            const scheduleDate = new Date(schedule.startTime);
            if (scheduleDate >= monthStart && scheduleDate <= monthEnd) {
                const dateKey = format(scheduleDate, 'yyyy-MM-dd');
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(schedule);
            }
            return acc;
        }, {});
    }, [targetMonth, allUserSchedules, selectedSpaceIndex]);

    const monthDays = getMonthDays(targetMonth);

    return (
        <View style={styles.monthContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.monthText}>{format(targetMonth, 'yyyy년 M월')}</Text>
                <Text style={styles.todayBtn}>Today ➤</Text>
            </View>

            <View style={styles.weekRow}>
                {WEEK_DAYS.map((day) => (
                    <Text key={day} style={[styles.weekday, { width: calendarWidth / 7 }]}>
                        {day}
                    </Text>
                ))}
            </View>

            <View style={[styles.dateGrid, { flex: 1 }]}>
                {Array(currentMonthNumRows).fill(null).map((_, rowIdx) => (
                    <View key={rowIdx} style={styles.dateRow}>
                        {Array(7).fill(null).map((_, colIdx) => {
                            const dateIndex = rowIdx * 7 + colIdx;
                            const date = monthDays[dateIndex];

                            const dateKey = date ? format(date, 'yyyy-MM-dd') : null;
                            const daySchedules = dateKey ? monthSchedulesMap[dateKey] || [] : [];

                            return (
                                <Pressable
                                    key={colIdx}
                                    style={[
                                        styles.dateCell,
                                        { width: calendarWidth / 7, height: `100%` },
                                    ]}
                                    onPress={() => date && onDatePress(date, daySchedules)}
                                >
                                    {date && (
                                        <>
                                            <Text style={{ fontWeight: 'bold', minHeight: 20 }}>{date.getDate()}</Text>
                                            {daySchedules.slice(0, 3).map((s, idx) => (
                                                <View
                                                    key={idx}
                                                    style={[
                                                        styles.scheduleTag,
                                                        { backgroundColor: s.color || '#ccc' },
                                                    ]}
                                                >
                                                    <Text style={styles.scheduleTitleText}>{s.name}</Text>
                                                </View>
                                            ))}
                                            {daySchedules.length > 3 && (
                                                <Text style={styles.moreText}>
                                                    +{daySchedules.length - 3} more
                                                </Text>
                                            )}
                                        </>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
});
// --- MonthCalendarView 컴포넌트 끝 ---


export default function PersonalMonth() {
    const { width: screenWidth } = Dimensions.get('window');
    const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

    const pagerRef = useRef(null);
    const [baseDate, setBaseDate] = useState(new Date());
    const [calendarWidth, setCalendarWidth] = useState(screenWidth);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDateForModal, setSelectedDateForModal] = useState(null);
    const [schedulesForModal, setSchedulesForModal] = useState([]);

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const selected_space = useUserStore((state) => state.selected_space);

    const setEditDate = useEditDateStore((state) => state.setEditDate); // 추가

    useEffect(() => {
        setUser(userData);
    }, []);

    const getMonthDays = (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const days = eachDayOfInterval({ start, end });
        const prefix = Array(start.getDay()).fill(null);
        return [...prefix, ...days];
    };

    const handlePageSelected = (e) => {
        const newPage = e.nativeEvent.position;
        const monthOffset = newPage - 1;

        if (monthOffset !== 0) {
            setScrollEnabled(false);

            const newBase = addMonths(baseDate, monthOffset);

            setTimeout(() => {
                setBaseDate(newBase);
                if (pagerRef.current) {
                    pagerRef.current.setPageWithoutAnimation(1);
                }
                InteractionManager.runAfterInteractions(() => {
                    setScrollEnabled(true);
                });
            }, 0);
        }
    };

    const handleDatePress = (date, schedules) => {
        setSelectedDateForModal(date);
        setSchedulesForModal(schedules);
        setIsModalVisible(true);
        setEditDate(date);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        // react-native-modal의 onModalHide 콜백을 사용하여 상태를 초기화하는 것이 더 정확합니다.
        // 현재는 애니메이션 종료 시간을 예측하여 setTimeout으로 지연 처리합니다.
        setTimeout(() => {
            setSelectedDateForModal(null);
            setSchedulesForModal([]);
        }, 300); // animationOut 시간 (기본 300ms)과 비슷하게 설정
    };

    const handleAddSchedule = (date) => {
        console.log(`일정 추가하기: ${format(date, 'yyyy-MM-dd')}`);
        handleCloseModal();
    };

    const renderOptimizedMonth = (offset) => {
        const targetMonth = addMonths(baseDate, offset);
        const monthDays = getMonthDays(targetMonth);
        const numRows = Math.ceil(monthDays.length / 7);

        return (
            <MonthCalendarView
                key={offset.toString()}
                targetMonth={targetMonth}
                calendarWidth={calendarWidth}
                allUserSchedules={user?.spaces || []}
                selectedSpaceIndex={selected_space}
                WEEK_DAYS={WEEK_DAYS}
                currentMonthNumRows={numRows}
                styles={styles}
                onDatePress={handleDatePress}
            />
        );
    };

    return (
        <View
            style={{ flex: 1 }}
            onLayout={(e) => setCalendarWidth(e.nativeEvent.layout.width)}
        >
            <PagerView
                ref={pagerRef}
                initialPage={1}
                onPageSelected={handlePageSelected}
                scrollEnabled={scrollEnabled}
                style={{ flex: 1 }}
            >
                {[-1, 0, 1].map((offset) => renderOptimizedMonth(offset))}
            </PagerView>

            {/* Daily Schedule Modal */}
            <Modal
                isVisible={isModalVisible} // react-native-modal의 isVisible prop 사용
                onBackdropPress={handleCloseModal} // 배경 클릭 시 닫기
                onSwipeComplete={handleCloseModal} // 스와이프하여 닫기
                // swipeDirection={['down']} // 아래로 스와이프할 때 닫기
                style={modalStyles.bottomModal} // 아래에서 올라오는 스타일
                animationIn="slideInUp" // 나타나는 애니메이션
                animationOut="slideOutDown" // 사라지는 애니메이션
                backdropOpacity={0.4} // 배경 불투명도
                onModalHide={() => { // 모달이 완전히 사라진 후 상태 초기화
                    setSelectedDateForModal(null);
                    setSchedulesForModal([]);
                }}
            >
                <DailyScheduleModalContent // 수정된 이름 사용
                    selectedDate={selectedDateForModal}
                    dailySchedules={schedulesForModal}
                    onAddSchedule={handleAddSchedule}
                    onClose={handleCloseModal} // DailyScheduleModalContent 내부의 닫기 버튼을 위해 전달
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#fff',
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    todayBtn: {
        fontSize: 14,
        color: '#666',
    },
    weekRow: {
        flexDirection: 'row',
        paddingBottom: 4,
        paddingTop: 8,
    },
    weekday: {
        textAlign: 'center',
        fontWeight: '600',
        color: '#666',
    },
    dateGrid: {
        flexDirection: 'column',
    },
    dateRow: {
        flexDirection: 'row',
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    dateCell: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 4,
        flexGrow: 1,
    },
    monthContainer: {
        flex: 1,
        paddingTop: 16,
        backgroundColor: '#fff',
    },
    scheduleTag: {
        borderRadius: 4,
        marginTop: 2,
        width: '100%',
        aspectRatio: "2.5/1",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 2,
    },
    scheduleTitleText: {
        fontSize: 11,
        color: 'white',
        fontWeight: 'bold',
        textAlign: "center",
    },
    moreText: {
        fontSize: 10,
        color: '#555',
        marginTop: 2,
    },
});

// react-native-modal의 스타일
const modalStyles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end', // 모달을 화면 아래에 정렬
        margin: 0, // 화면 전체 너비를 사용하도록 마진 제거
    },
    // DailyScheduleModalContent 내부의 modalContainer와 중복되지 않도록 이름을 다르게 지정하거나 제거
    // 그러나 DailyScheduleModalContent가 순수하게 '콘텐츠'만 담당하므로,
    // 그 내부의 modalContainer 스타일은 그대로 유지합니다.
});