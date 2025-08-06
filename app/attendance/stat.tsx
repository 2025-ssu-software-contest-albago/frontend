import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

// 예시 데이터: { [year]: { [month]: { ... } } }
const statsData = {
  '2025': {
    '08': { totalDays: 20, lateDays: 2, earlyLeaveDays: 1, totalHours: 160 },
    '07': { totalDays: 18, lateDays: 1, earlyLeaveDays: 0, totalHours: 140 },
  },
  '2024': {
    '08': { totalDays: 15, lateDays: 0, earlyLeaveDays: 0, totalHours: 120 },
  },
  // ...필요시 더 추가
};

export default function AttendanceStatScreen() {
  const years = getYearList();
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(monthList[new Date().getMonth()]);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  // 선택된 년/월의 데이터
  const stat =
    statsData[selectedYear] && statsData[selectedYear][selectedMonth]
      ? statsData[selectedYear][selectedMonth]
      : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>근태 통계</Text>
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
      {/* 통계 데이터 */}
      {stat ? (
        <>
          <View style={styles.statBox}>
            <Text style={styles.label}>총 출근일수</Text>
            <Text style={styles.value}>{stat.totalDays}일</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.label}>지각</Text>
            <Text style={styles.value}>{stat.lateDays}회</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.label}>조퇴</Text>
            <Text style={styles.value}>{stat.earlyLeaveDays}회</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.label}>총 근무시간</Text>
            <Text style={styles.value}>{stat.totalHours}시간</Text>
          </View>
        </>
      ) : (
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 30 }}>
          해당 기간의 통계가 없습니다.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24 },
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
  statBox: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  label: { fontSize: 18, color: '#555' },
  value: { fontSize: 18, fontWeight: 'bold', color: '#222' },
});