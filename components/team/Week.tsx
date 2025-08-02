import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  InteractionManager,
  Pressable,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { addWeeks, startOfWeek, format, addDays, parseISO, isSameDay } from 'date-fns';
import { useUserStore } from '@/scripts/store/userStore';
import { scheduleColors } from '@/scripts/color/scheduleColor';
import DailyScheduleModalContent from './DailyScheduleModal'; // ✅ 경로 확인
import Modal from 'react-native-modal'; // ✅ 모달 라이브러리

const { height } = Dimensions.get('window');
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function PersonalWeek() {
  const pagerRef = useRef(null);
  const [baseDate, setBaseDate] = useState(new Date());
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const user = useUserStore((state) => state.user);
  const selected_space = useUserStore((state) => state.selected_space);

  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태
  const [selectedDate, setSelectedDate] = useState(null); // ✅ 선택된 날짜
  const [modalSchedules, setModalSchedules] = useState([]); // ✅ 선택된 날짜의 스케줄

  const [showCover, setShowCover] = useState(false);
  const [coverDate, setCoverDate] = useState(null);

  const getCurrentWeek = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const openModalForDate = (date, scheduleMap) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    setModalSchedules(scheduleMap[dateKey] || []);
    setShowModal(true);
  };

  const renderWeek = (targetDate) => {
    const weekDates = getCurrentWeek(targetDate);
    const schedules = user?.spaces?.[selected_space]?.schedules || [];

    const scheduleMap = schedules.reduce((acc, s) => {
      const localStart = parseISO(s.startTime);
      const dateKey = format(localStart, 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(s);
      return acc;
    }, {});

    Object.keys(scheduleMap).forEach(dateKey => {
      scheduleMap[dateKey].sort((a, b) => {
        const startTimeA = parseISO(a.startTime).getTime();
        const startTimeB = parseISO(b.startTime).getTime();
        if (startTimeA !== startTimeB) return startTimeA - startTimeB;
        return a.name.localeCompare(b.name);
      });
    });

    return (
      <View style={styles.weekContainer}>
        <Text style={styles.dateRangeText}>
          {format(weekDates[0], 'M월 d일')} - {format(weekDates[6], 'M월 d일')}
        </Text>

        <View style={styles.weekdayRow}>
          {WEEK_DAYS.map((day, idx) => (
            <View key={idx} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        <ScrollView style={styles.scheduleScrollView}>
          <View style={styles.scheduleGrid}>
            {weekDates.map((date, idx) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const daySchedules = scheduleMap[dateKey] || [];
              return (
                <Pressable
                  key={idx}
                  style={styles.dayColumn}
                  onPress={() => openModalForDate(date, scheduleMap)} // ✅ 날짜 클릭 시 모달 열기
                >
                  {daySchedules.map((s, i) => (
                    <View
                      key={i}
                      style={[
                        styles.scheduleBlockStacked,
                        { backgroundColor: scheduleColors[s.color]?.background || '#ccc' },
                      ]}
                    >
                      <Text style={[
                        styles.scheduleText,
                        { color: scheduleColors[s.color]?.font || '#fff' }
                      ]}>{s.name}</Text>
                      <Text style={[
                        styles.scheduleTimeText,
                        { color: scheduleColors[s.color]?.font || '#fff' }
                      ]}>
                        {format(parseISO(s.startTime), 'HH:mm')} - {format(parseISO(s.endTime), 'HH:mm')}
                      </Text>
                    </View>
                  ))}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderWeekPage = (offset) => {
    const targetDate = addWeeks(baseDate, offset);
    return (
      <View key={offset} style={{ flex: 1 }}>
        {renderWeek(targetDate)}
      </View>
    );
  };

  const handlePageSelected = (e) => {
    const newPage = e.nativeEvent.position;
    const offset = newPage - 1;
    if (offset !== 0) {
      setScrollEnabled(false);
      const newBase = addWeeks(baseDate, offset);

      setCoverDate(newBase);
      setShowCover(true);

      setTimeout(() => {
        setBaseDate(newBase);
        pagerRef.current?.setPageWithoutAnimation(1);
        InteractionManager.runAfterInteractions(() => {
          setScrollEnabled(true);
          setShowCover(false);
        });
      }, 0);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        initialPage={1}
        onPageSelected={handlePageSelected}
        scrollEnabled={scrollEnabled}
        style={{ flex: 1 }}
      >
        {[-1, 0, 1].map((offset) => renderWeekPage(offset))}
      </PagerView>

      {showCover && coverDate && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#fff', zIndex: 1
        }}>
          {renderWeek(coverDate)}
        </View>
      )}

      {/* ✅ 모달: 하단 슬라이드 + 배경 어둡게 + 클릭 시 닫힘 */}
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        onBackButtonPress={() => setShowModal(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver
      >
        <DailyScheduleModalContent
          selectedDate={selectedDate}
          dailySchedules={modalSchedules}
          onAddSchedule={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </View>
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
  scheduleScrollView: {
    flex: 1,
  },
  scheduleGrid: {
    flexDirection: 'row',
    flex: 1,
  },
  dayColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  scheduleBlockStacked: {
    width: '100%',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scheduleTimeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 2,
  },
});
