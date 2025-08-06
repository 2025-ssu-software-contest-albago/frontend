import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView } from 'react-native';

// 예시 데이터 (여러 년/월 포함)
const dummyData = [
  { id: '1', date: '2025-08-01', checkIn: '09:01', checkOut: '18:02' },
  { id: '2', date: '2025-08-02', checkIn: '09:05', checkOut: '18:00' },
  { id: '3', date: '2025-08-03', checkIn: '08:59', checkOut: '17:55' },
  { id: '4', date: '2025-07-28', checkIn: '09:00', checkOut: '18:00' },
  { id: '5', date: '2024-08-01', checkIn: '09:10', checkOut: '18:05' },
];

// 2010년부터 올해까지 리스트 생성
const getYearList = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 2010; y--) {
    years.push(String(y));
  }
  return years;
};

const monthList = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12'
];

export default function AttendanceHistoryScreen() {
  const years = getYearList();
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(monthList[new Date().getMonth()]);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  // 선택된 년/월에 해당하는 데이터만 필터링
  const filteredData = dummyData.filter(
    item => item.date.startsWith(`${selectedYear}-${selectedMonth}`)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>출퇴근 기록</Text>
      {/* 년도 선택 드롭다운 */}
      <View style={styles.selectRow}>
        <Text style={styles.selectLabel}>년도</Text>
        <TouchableOpacity
          style={[styles.selectItem, styles.dropdownTrigger]}
          onPress={() => setYearModalVisible(true)}
        >
          <Text style={[styles.selectText, styles.dropdownText]}>
            {selectedYear}년 ▼
          </Text>
        </TouchableOpacity>
      </View>
      {/* 년도 리스트 모달 */}
      <Modal
        visible={yearModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setYearModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setYearModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {years.map(year => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.selectItem,
                    selectedYear === year && styles.activeSelectItem,
                    { marginBottom: 0 }
                  ]}
                  onPress={() => {
                    setSelectedYear(year);
                    setYearModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.selectText,
                    selectedYear === year && styles.activeSelectText
                  ]}>
                    {year}년
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* 월 선택 드롭다운 */}
      <View style={styles.selectRow}>
        <Text style={styles.selectLabel}>월</Text>
        <TouchableOpacity
          style={[styles.selectItem, styles.dropdownTrigger]}
          onPress={() => setMonthModalVisible(true)}
        >
          <Text style={[styles.selectText, styles.dropdownText]}>
            {selectedMonth}월 ▼
          </Text>
        </TouchableOpacity>
      </View>
      {/* 월 리스트 모달 */}
      <Modal
        visible={monthModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMonthModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {monthList.map(month => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.selectItem,
                    selectedMonth === month && styles.activeSelectItem,
                    { marginBottom: 0 }
                  ]}
                  onPress={() => {
                    setSelectedMonth(month);
                    setMonthModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.selectText,
                    selectedMonth === month && styles.activeSelectText
                  ]}>
                    {month}월
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* 출퇴근 기록 리스트 */}
      {filteredData.length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 30 }}>
          기록이 없습니다.
        </Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.record}>
              <Text style={styles.date}>{item.date}</Text>
              <Text>출근: {item.checkIn}   퇴근: {item.checkOut}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 18 },
  selectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  selectLabel: { fontSize: 16, fontWeight: 'bold', marginRight: 10, width: 40 },
  selectList: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  selectItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 8,
  },
  activeSelectItem: {
    backgroundColor: '#1976d2',
  },
  selectText: {
    fontSize: 15,
    color: '#555',
  },
  activeSelectText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownTrigger: {
    minWidth: 80,
    backgroundColor: '#e3e3e3',
    marginRight: 0,
    marginBottom: 0,
  },
  dropdownText: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minWidth: 120,
    maxHeight: 350,
    elevation: 5,
  },
  record: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  date: { fontWeight: 'bold', marginBottom: 4 },
});