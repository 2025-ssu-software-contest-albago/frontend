import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
} from 'date-fns';

import { useUserStore } from '@/scripts/store/userStore';
import { userData } from '@/scripts/dummyData/userData';

const { width: screenWidth } = Dimensions.get('window');
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function PersonalMonth() {
    const pagerRef = useRef<PagerView>(null);
    const [baseDate, setBaseDate] = useState(new Date());
    const [calendarWidth, setCalendarWidth] = useState(screenWidth);

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const selected_space = useUserStore((state) => state.selected_space);

    useEffect(() => {
        setUser(userData);
    }, []);

    const getMonthDays = (date: Date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const days = eachDayOfInterval({ start, end });
        const prefix = Array(start.getDay()).fill(null);
        return [...prefix, ...days];
    };

    const getScheduleMapForMonth = (targetDate: Date) => {
        if (!user || !user.spaces || selected_space == null) return {};

        const schedules = user.spaces[selected_space]?.schedules || [];

        return schedules.reduce((acc, schedule) => {
            const dateKey = format(new Date(schedule.startTime), 'yyyy-MM-dd');
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(schedule);
            return acc;
        }, {});
    };

    const renderMonth = (offset: number) => {
        const targetMonth = addMonths(baseDate, offset);
        const monthDays = getMonthDays(targetMonth);
        const numRows = Math.ceil(monthDays.length / 7);
        const monthSchedulesMap = getScheduleMapForMonth(targetMonth);

        return (
            <View key={offset.toString()} style={styles.monthContainer}>
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
                    {Array(numRows).fill(null).map((_, rowIdx) => (
                        <View key={rowIdx} style={styles.dateRow}>
                            {Array(7).fill(null).map((_, colIdx) => {
                                const dateIndex = rowIdx * 7 + colIdx;
                                const date = monthDays[dateIndex];

                                const dateKey = date ? format(date, 'yyyy-MM-dd') : null;
                                const daySchedules = dateKey ? monthSchedulesMap[dateKey] || [] : [];

                                return (
                                    <View
                                        key={colIdx}
                                        style={[
                                            styles.dateCell,
                                            { width: calendarWidth / 7, height: `${100 / numRows}%` },
                                        ]}
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
                                                        <Text style={styles.scheduleTitleText}>{s.title}</Text>
                                                    </View>
                                                ))}
                                                {daySchedules.length > 3 && (
                                                    <Text style={styles.moreText}>
                                                        +{daySchedules.length - 3} more
                                                    </Text>
                                                )}
                                            </>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </View>
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
                onPageSelected={(e) => {
                    const newPage = e.nativeEvent.position;
                    setBaseDate((prev) => addMonths(prev, newPage - 1));
                    if (pagerRef.current) {
                        pagerRef.current.setPageWithoutAnimation(1);
                    }
                }}
                style={{ flex: 1 }}
            >
                {[-1, 0, 1].map((offset) => renderMonth(offset))}
            </PagerView>
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
    },
    scheduleText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    moreText: {
        fontSize: 10,
        color: '#555',
        marginTop: 2,
    }, 
    scheduleTitleText: {
        fontSize: 11,
        color: '#fff',
        fontWeight: 'bold',
        padding: 1,
    },

    scheduleTimeText: {
        fontSize: 9,
        color: '#f0f0f0',
        marginTop: 1,
    },
});
