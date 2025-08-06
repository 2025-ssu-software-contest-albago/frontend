import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';

// 예시 데이터 (날짜별)
const teamAttendance = [
  // 2025-08-04
  { id: '1', name: '김지훈', date: '2025-08-04', checkIn: '09:01', checkOut: '18:02', status: '정상' },
  { id: '2', name: '이서연', date: '2025-08-04', checkIn: '09:15', checkOut: '18:00', status: '지각' },
  { id: '3', name: '최민지', date: '2025-08-04', checkIn: '08:59', checkOut: '17:55', status: '정상' },
  // 2025-08-03
  { id: '4', name: '김지훈', date: '2025-08-03', checkIn: '09:00', checkOut: '18:00', status: '정상' },
  { id: '5', name: '이서연', date: '2025-08-03', checkIn: '09:20', checkOut: '18:00', status: '지각' },
  { id: '6', name: '최민지', date: '2025-08-03', checkIn: '08:58', checkOut: '17:55', status: '정상' },
];

// 날짜 리스트 생성 (데이터에 있는 날짜만)
const getDateList = () => {
  const set = new Set(teamAttendance.map(item => item.date));
  return Array.from(set).sort((a, b) => b.localeCompare(a));
};

export default function AttendanceAdminScreen() {
  const dateList = getDateList();
  // 오늘 날짜가 데이터에 있으면 오늘, 없으면 가장 최근 날짜로 기본 선택
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const defaultDate = dateList.includes(todayStr) ? todayStr : dateList[0];

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  // 선택된 날짜의 팀원 출퇴근 현황만 필터링
  const filteredData = teamAttendance.filter(item => item.date === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>팀원 출퇴근 현황</Text>
      {/* 날짜 선택 드롭다운 */}
      <View style={styles.selectRow}>
        <Text style={styles.selectLabel}>날짜</Text>
        <TouchableOpacity
          style={[styles.selectItem, styles.dropdownTrigger]}
          onPress={() => setDateModalVisible(true)}
        >
          <Text style={[styles.selectText, styles.dropdownText]}>
            {selectedDate} ▼
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={dateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setDateModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {dateList.map(date => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.selectItem,
                    selectedDate === date && styles.activeSelectItem,
                    { marginBottom: 0 }
                  ]}
                  onPress={() => {
                    setSelectedDate(date);
                    setDateModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.selectText,
                    selectedDate === date && styles.activeSelectText
                  ]}>
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* 현황 리스트 */}
      {filteredData.length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 30 }}>
          해당 날짜의 기록이 없습니다.
        </Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.record}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>출근: {item.checkIn}   퇴근: {item.checkOut}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === '지각'
                    ? { color: '#E74C3C' }
                    : item.status === '정상'
                    ? { color: '#2ECC71' }
                    : null,
                ]}
              >
                {item.status}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  selectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  selectLabel: { fontSize: 16, fontWeight: 'bold', marginRight: 10, width: 40 },
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
    minWidth: 120,
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
    minWidth: 140,
    maxHeight: 350,
    elevation: 5,
  },
  record: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  status: { marginTop: 4, fontWeight: 'bold', color: '#2ECC71' },
});