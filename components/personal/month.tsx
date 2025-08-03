import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, InteractionManager, Pressable, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
    isSameMonth,
    isSameDay
} from 'date-fns';

import { useUserStore } from '@/scripts/store/userStore';
import { useEditDateStore } from '@/scripts/store/personalStore';
import { userData } from '@/scripts/dummyData/userData';
import DailyScheduleModalContent from './DailyScheduleModal';
import Modal from 'react-native-modal';
import { scheduleColors } from '@/scripts/color/scheduleColor';
import Feather from '@expo/vector-icons/Feather';

const MonthCalendarView = React.memo(({
    targetMonth,
    calendarWidth,
    allUserSchedules,
    selectedSpaceIndex,
    WEEK_DAYS,
    currentMonthNumRows,
    styles,
    onDatePress,
    onTodayPress
}) => {
    const getMonthDays = (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const days = eachDayOfInterval({ start, end });
        const prefix = Array(start.getDay()).fill(null);
        return [...prefix, ...days];
    };

    const monthSchedulesMap = useMemo(() => {
        if (selectedSpaceIndex == null || !allUserSchedules[selectedSpaceIndex] || allUserSchedules[selectedSpaceIndex]?.type === "team") return {};
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
                {!isSameMonth(targetMonth, new Date()) && (
                    <TouchableOpacity
                        onPress={onTodayPress}
                        activeOpacity={0.6} // 눌렀을 때 투명도 조절 (기본은 0.2~0.3)
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Text style={styles.todayBtn}>Today</Text>
                        <Feather name="rotate-ccw" size={16} color="#007AFF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.weekRow}>
                {WEEK_DAYS.map((day, index) => {
                    const isWeekend = index === 0 || index === 6; // 일요일(index 0) 또는 토요일(index 6)
                    return (
                        <Text
                            key={day}
                            style={[
                                styles.weekday,
                                { width: calendarWidth / 7 },
                                isWeekend && { color: '#fc3c3cff' }, // 빨간색
                            ]}
                        >
                            {day}
                        </Text>
                    );
                })}
            </View>

            <View style={[styles.dateGrid, { flex: 1 }]}>
                {Array(currentMonthNumRows).fill(null).map((_, rowIdx) => (
                    <View key={rowIdx} style={styles.dateRow}>
                        {Array(7).fill(null).map((_, colIdx) => {
                            const dateIndex = rowIdx * 7 + colIdx;
                            const date = monthDays[dateIndex];
                            const dateKey = date ? format(date, 'yyyy-MM-dd') : null;
                            const daySchedules = dateKey ? monthSchedulesMap[dateKey] || [] : [];
                            const isToday = date && isSameDay(date, new Date());

                            return (
                                <Pressable
                                    key={colIdx}
                                    style={[
                                        styles.dateCell,
                                        { width: calendarWidth / 7, height: `100%` },
                                    ]}
                                    onPress={() => date && onDatePress(date, daySchedules)}
                                >
                                    {date && ( //각 날짜를 표현하는 구역 
                                        <>
                                            <View
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 14,
                                                    overflow: 'hidden', // ✅ 강제 클리핑
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: isToday ? '#007AFF' : 'transparent', // 현재날짜에 동그라미
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        color: isToday
                                                            ? 'white'
                                                            : colIdx === 0 || colIdx === 6
                                                                ? '#fc3c3cff' // 일/토 빨간색
                                                                : 'black',
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {date.getDate()}
                                                </Text>
                                            </View>

                                            {daySchedules.slice(0, 3).map((s, idx) => (
                                                <View
                                                    key={idx}
                                                    style={[
                                                        styles.scheduleTag,
                                                        { backgroundColor: scheduleColors[s.color].background || '#ccc' },
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.scheduleTitleText,
                                                        { color: scheduleColors[s.color].font }
                                                    ]}>{s.name}</Text>
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

    // 더블버퍼링용
    const [showCover, setShowCover] = useState(false);
    const [coverDate, setCoverDate] = useState(null);

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const selected_space = useUserStore((state) => state.selected_space);
    const setEditDate = useEditDateStore((state) => state.setEditDate);

    useEffect(() => {
        if (!user || user.spaces.length === 0) {
            setUser(userData); // ✅ 진짜 초기 진입일 때만 세팅
        }
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
            const newDate = addMonths(baseDate, monthOffset);

            setCoverDate(newDate);
            setShowCover(true);

            setTimeout(() => {
                setBaseDate(newDate);
                if (pagerRef.current) {
                    pagerRef.current.setPageWithoutAnimation(1);
                }
                InteractionManager.runAfterInteractions(() => {
                    setScrollEnabled(true);
                    setShowCover(false);
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
        setTimeout(() => {
            setSelectedDateForModal(null);
            setSchedulesForModal([]);
        }, 300);
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
                onTodayPress={handleGoToToday}
            />
        );
    };

    const handleGoToToday = () => {
        const today = new Date();
        setBaseDate(today); // 중앙 페이지를 오늘 기준으로 재설정
        pagerRef.current?.setPageWithoutAnimation(1); // 중앙 페이지로 강제 이동
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

            {showCover && coverDate && (
                <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: '#fff',
                    zIndex: 1,
                }}>
                    <MonthCalendarView
                        targetMonth={coverDate}
                        calendarWidth={calendarWidth}
                        allUserSchedules={user?.spaces || []}
                        selectedSpaceIndex={selected_space}
                        WEEK_DAYS={WEEK_DAYS}
                        currentMonthNumRows={Math.ceil(getMonthDays(coverDate).length / 7)}
                        styles={styles}
                        onDatePress={handleDatePress}
                        onTodayPress={handleGoToToday}
                    />
                </View>
            )}

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={handleCloseModal}
                onSwipeComplete={handleCloseModal}
                style={modalStyles.bottomModal}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.4}
                onModalHide={() => {
                    setSelectedDateForModal(null);
                    setSchedulesForModal([]);
                }}
            >
                <DailyScheduleModalContent
                    selectedDate={selectedDateForModal}
                    dailySchedules={schedulesForModal}
                    onAddSchedule={handleAddSchedule}
                    onClose={handleCloseModal}
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
        color: '#007AFF', // ✅ 파란색으로
        fontWeight: '500',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
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
        alignItems: 'center',
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

const modalStyles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
});
