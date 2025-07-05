// 수정된 PersonalWeek.tsx (스와이프 중 렌더링 보장 후 다음 스와이프 허용)
import React, { useState, useRef, useMemo } from 'react'; // useEffect는 사용하지 않으므로 제거
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform, // Platform은 사용하지 않으므로 제거
  InteractionManager,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { addWeeks, startOfWeek, format, addDays, parseISO } from 'date-fns';
import { useUserStore } from '@/scripts/store/userStore';

const { height } = Dimensions.get('window');
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function PersonalWeek() {
  const pagerRef = useRef(null);
  const [baseDate, setBaseDate] = useState(new Date());
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const user = useUserStore((state) => state.user);
  const selected_space = useUserStore((state) => state.selected_space);

  const getCurrentWeek = (offset = 0) => {
    const start = startOfWeek(addWeeks(baseDate, offset), { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const renderWeek = (offset) => {
    const weekDates = getCurrentWeek(offset);
    // const [startHour, endHour, hourBlockHeight, , totalHeight] = getTimeBounds(weekDates); // 제거
    const schedules = user?.spaces?.[selected_space]?.schedules || [];

    // 스케줄을 날짜별로 그룹화하고 정렬
    const scheduleMap = schedules.reduce((acc, s) => {
      const localStart = parseISO(s.startTime);
      const dateKey = format(localStart, 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(s);
      return acc;
    }, {});

    // 각 날짜의 스케줄을 정렬
    Object.keys(scheduleMap).forEach(dateKey => {
      scheduleMap[dateKey].sort((a, b) => {
        const startTimeA = parseISO(a.startTime).getTime();
        const startTimeB = parseISO(b.startTime).getTime();

        if (startTimeA !== startTimeB) {
          return startTimeA - startTimeB; // 시작 시간 오름차순
        }
        return a.name.localeCompare(b.name); // 시작 시간이 같으면 이름순
      });
    });

    return (
      <View key={offset} style={styles.weekContainer}>
        <Text style={styles.dateRangeText}>
          {format(weekDates[0], 'M월 d일')} - {format(weekDates[6], 'M월 d일')}
        </Text>

        <View style={styles.weekdayRow}>
          {/* <View style={styles.timeLabelColumn} /> // 왼쪽 타임라인 컬럼 제거 */}
          {WEEK_DAYS.map((day, idx) => (
            <View key={idx} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* ScrollView 내부에 시간표 블록 렌더링 */}
        <ScrollView style={styles.scheduleScrollView}>
          <View style={styles.scheduleGrid}>
            {/* {weekDates.map((date, idx) => { // 이 부분은 이제 dayColumn 내부에서 처리 */}
            {weekDates.map((date, idx) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const daySchedules = scheduleMap[dateKey] || []; // 해당 날짜의 스케줄 배열

              return (
                <View key={idx} style={styles.dayColumn}>
                  {daySchedules.map((s, i) => (
                    <View
                      key={i}
                      style={[
                        styles.scheduleBlockStacked, // 새로운 스타일 적용
                        { backgroundColor: s.color || '#ccc' },
                      ]}
                    >
                      <Text style={styles.scheduleText}>{s.name}</Text>
                      <Text style={styles.scheduleTimeText}>
                        {format(parseISO(s.startTime), 'HH:mm')} - {format(parseISO(s.endTime), 'HH:mm')}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const handlePageSelected = (e) => {
    const newPage = e.nativeEvent.position;
    const offset = newPage - 1;
    if (offset !== 0) {
      setScrollEnabled(false);
      const newBase = addWeeks(baseDate, offset);
      setTimeout(() => {
        setBaseDate(newBase);
        pagerRef.current?.setPageWithoutAnimation(1);
        InteractionManager.runAfterInteractions(() => {
          setScrollEnabled(true);
        });
      }, 0);
    }
  };

  return (
    <PagerView
      ref={pagerRef}
      initialPage={1}
      onPageSelected={handlePageSelected}
      scrollEnabled={scrollEnabled}
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
    paddingBottom: 10,
    // paddingLeft: 40, // 타임라인 제거로 인해 이 패딩도 제거
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
  scheduleScrollView: { // 스케줄을 담을 ScrollView 스타일
    flex: 1,
  },
  scheduleGrid: { // 요일별 스케줄 컬럼을 담을 그리드 컨테이너
    flexDirection: 'row',
    flex: 1, // ScrollView 내에서 flex를 차지하도록
  },
  dayColumn: {
    flex: 1,
    // position: 'relative', // 더 이상 absolute 포지셔닝을 사용하지 않으므로 제거
    borderRightWidth: 1, // 요일별 구분선
    borderColor: '#eee',
    paddingHorizontal: 4, // 블록 간의 여백
    paddingVertical: 8, // 상하 여백
    alignItems: 'center', // 블록들을 중앙 정렬
  },
  scheduleBlockStacked: { // 새로 추가된 스케줄 블록 스타일 (쌓기 위함)
    width: '100%', // 부모 dayColumn에 꽉 차게
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 6, // 블록 간의 간격
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // 그림자 효과 추가
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, // 안드로이드 그림자
  },
  scheduleText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scheduleTimeText: { // 시간 표시를 위한 새로운 텍스트 스타일
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 2,
  }
});