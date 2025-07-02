// WeekPage.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Column from '@/components/personal/column';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TIME_LABEL_WIDTH = 20;
const HORIZONTAL_PADDING = 20;
const CELL_WIDTH = (SCREEN_WIDTH - TIME_LABEL_WIDTH - HORIZONTAL_PADDING) / 7;

const WeekPage = React.memo(({ baseDate, offset, selectedSpace, setSpaceModalVisible, hours }) => {
  const weekStart = useMemo(() => baseDate.add(offset * 7, 'day'), [baseDate, offset]);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day').format('M.D')),
    [weekStart]
  );

  return (
    <View style={styles.page}>
      <Text style={styles.dateRange}>{weekDates[0]} - {weekDates[6]}</Text>

      <View style={styles.dayHeader}>
        <View style={{ width: TIME_LABEL_WIDTH }} />
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <Text key={i} style={[styles.dayText, { width: CELL_WIDTH }]}>{day}</Text>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scheduleGrid} horizontal={false}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: TIME_LABEL_WIDTH }}>
            {hours.map((h, rowIdx) => {
              const isHour = Number.isInteger(h);
              const hourText = isHour ? String(h).padStart(2, '0') : '';
              return (
                <Text key={rowIdx} style={styles.timeLabel}>
                  {hourText}
                </Text>
              );
            })}
          </View>
          {Array.from({ length: 7 }, (_, colIdx) => (
            <Column key={colIdx} columnIndex={colIdx} hours={hours} CELL_WIDTH={CELL_WIDTH} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: 'white' },
  dateRange: { fontSize: 18, textAlign: 'center', marginBottom: 10 },
  dayHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  dayText: { textAlign: 'center', fontWeight: 'bold' },
  scheduleGrid: { paddingHorizontal: 10, paddingBottom: 30 },
  timeLabel: {
    height: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
  },
});

export default WeekPage;
