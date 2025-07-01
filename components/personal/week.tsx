import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import PagerView from 'react-native-pager-view';
import { addWeeks, startOfWeek, format, addDays } from 'date-fns';
import { useUserStore } from '@/scripts/store/userStore';

const { height } = Dimensions.get('window');
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function PersonalWeek() {
  const pagerRef = useRef(null);
  const [baseDate, setBaseDate] = useState(new Date());
  const user = useUserStore((state) => state.user);
  const selected_space = useUserStore((state) => state.selected_space);

  const getCurrentWeek = (offset = 0) => {
    const start = startOfWeek(addWeeks(baseDate, offset), { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getTimeBounds = (weekDates) => {
    const schedules = user?.spaces?.[selected_space]?.schedules || [];
    let startHour = 9;
    let endHour = 18;

    const weekDateStrs = weekDates.map((d) => format(d, 'yyyy-MM-dd'));

    schedules.forEach((s) => {
      const localStart = new Date(s.startTime);
      const localEnd = new Date(s.endTime);
      const dateStr = format(localStart, 'yyyy-MM-dd');
      if (weekDateStrs.includes(dateStr)) {
        const start = localStart.getHours() + localStart.getMinutes() / 60;
        const end = localEnd.getHours() + localEnd.getMinutes() / 60;
        startHour = Math.min(startHour, Math.floor(start));
        endHour = Math.max(endHour, Math.ceil(end + 3));
      }
    });

    const hourBlockHeight = (height - 180) / 8;
    const totalHours = endHour - startHour;
    const totalHeight = hourBlockHeight * totalHours;

    return [startHour, endHour, hourBlockHeight, totalHours, totalHeight];
  };

  const renderWeek = (offset) => {
    const weekDates = getCurrentWeek(offset);
    const [startHour, endHour, hourBlockHeight, , totalHeight] = getTimeBounds(weekDates);
    const schedules = user?.spaces?.[selected_space]?.schedules || [];

    const scheduleMap = schedules.reduce((acc, s) => {
      const localStart = new Date(s.startTime);
      const dateKey = format(localStart, 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(s);
      return acc;
    }, {});

    const timeSlots = [];
    for (let t = startHour; t <= endHour; t += 0.5) {
      timeSlots.push(t);
    }

    return (
      <View key={offset} style={styles.weekContainer}>

        {/* 날짜 */}
        <Text style={styles.dateRangeText}>
          {format(weekDates[0], 'M월 d일')} - {format(weekDates[6], 'M월 d일')}
        </Text>

        {/* 요일 */}
        <View style={styles.weekdayRow}>
          <View style={styles.timeLabelColumn} />
          {WEEK_DAYS.map((day, idx) => (
            <View key={idx} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* 각 세로칸 */}
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', height: totalHeight }}>

            {/* 왼쪽 타임스탬프 */}
            <View style={styles.timeLabelColumn}>
              {timeSlots.map((t, i) =>
                Number.isInteger(t) ? (
                  <View key={i} style={[styles.timeLabelRow, { height: hourBlockHeight }]}>
                    <Text style={styles.timeText}>{`${t}`}</Text>
                  </View>
                ) : null
              )}
            </View>

            {/* 각 시간표 */}
            {weekDates.map((date, idx) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const daySchedules = scheduleMap[dateKey] || [];
              return (
                <View key={idx} style={styles.dayColumn}>
                  {daySchedules.map((s, i) => {
                    const start = new Date(s.startTime);
                    const end = new Date(s.endTime);
                    //여기까진 문제없고

                    const startTotal = start.getHours() + start.getMinutes() / 60;
                    const endTotal = end.getHours() + end.getMinutes() / 60;

                    //문제없음

                    const top = (startTotal - startHour + 1) * hourBlockHeight;
                    const height = (endTotal - startTotal + 1) * hourBlockHeight;

                    return (
                      <View
                        key={i}
                        style={[
                          styles.scheduleBlock,
                          {
                            top,
                            height,
                            backgroundColor: s.color || '#ccc',
                          },
                        ]}
                      >
                        <Text style={styles.scheduleText}>{s.title}</Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <PagerView
      ref={pagerRef}
      initialPage={1}
      onPageSelected={(e) => {
        const newPage = e.nativeEvent.position;
        setBaseDate((prev) => addWeeks(prev, newPage - 1));
        if (pagerRef.current) {
          pagerRef.current.setPageWithoutAnimation(1);
        }
      }}
      style={{ flex: 1 }}
    >
      {[-1, 0, 1].map((offset) => renderWeek(offset))}
    </PagerView>
  );
}

const styles = StyleSheet.create({
  weekContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 8,
  },
  dateRangeText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  timeLabelColumn: {
    width: 40,
    marginTop: 20,
  },
  timeLabelRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  dayColumn: {
    flex: 1,
    position: 'relative',
  },
  scheduleBlock: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 4,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scheduleText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
