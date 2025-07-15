import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/scripts/store/userStore';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';

export default function PersonalSalary() {
  const user = useUserStore(state => state.user);
  const selectedSpaceIndex = useUserStore(state => state.selected_space);
  const selectedSpace = user?.spaces[selectedSpaceIndex];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [currentMonth, setCurrentMonth] = useState(dayjs());

  if (!user || !selectedSpace) {
    return (
      <View style={styles.centered}>
        <Text>사용자 데이터를 불러오는 중...</Text>
      </View>
    );
  }

  // 현재 달 스케줄 필터
  const monthSchedules = useMemo(() => {
    return selectedSpace.schedules.filter(schedule =>
      dayjs(schedule.startTime).isSame(currentMonth, 'month')
    );
  }, [selectedSpace, currentMonth]);

  // 근무지별 데이터로 그룹핑
  const workPlaceStats = useMemo(() => {
    const stats = {};
    monthSchedules.forEach(sch => {
      const duration = dayjs(sch.endTime).diff(dayjs(sch.startTime), 'hour', true);
      if (!stats[sch.workPlaceId]) {
        stats[sch.workPlaceId] = { name: sch.name, color: sch.color, totalAmount: 0, totalHours: 0 };
      }
      stats[sch.workPlaceId].totalAmount += duration * sch.hourlyWage;
      stats[sch.workPlaceId].totalHours += duration;
    });
    return stats;
  }, [monthSchedules]);

  // 총액 & 총시간
  const totalAmount = Object.values(workPlaceStats).reduce((acc, w) => acc + w.totalAmount, 0);
  const totalHours = Object.values(workPlaceStats).reduce((acc, w) => acc + w.totalHours, 0);

  // 현재 달 기간
  const period = `${currentMonth.startOf('month').format('M.D')} - ${currentMonth.endOf('month').format('M.D')}`;

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top + 30 }]}>
      <TouchableOpacity onPress={() => router.push('/detail/personalTotalSalary')}>
        <View style={styles.totalCard}>
          <Text style={styles.monthTitle}>{currentMonth.format('M')}월 총 금액</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>총액</Text>
            <Text style={styles.totalValue}>{Math.round(totalAmount).toLocaleString()}원</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.workCard}>
        <Text style={styles.workTitle}>근무지 관리</Text>
        {selectedSpace?.workPlaces?.map(wp => {
          const stats = workPlaceStats[wp.id] ?? { totalAmount: 0, totalHours: 0 };
          return (
            <View key={wp.id} style={styles.workRow}>
              <View style={[styles.colorBar, { backgroundColor: wp.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.workName}>{wp.name}</Text>
                <Text style={styles.period}>{period}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.amount}>{Math.round(stats.totalAmount).toLocaleString()}원</Text>
                <Text style={styles.hours}>{Math.round(stats.totalHours)}시간</Text>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.addRow} onPress={()=>{
          router.push("/addWorkPlace")
        }}>
          <Text style={styles.addText}>+ 근무지 추가하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  totalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    alignItems: 'center'
  },
  monthTitle: {
    fontSize: 16, color: '#888', marginBottom: 50
  },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%",
  },
  totalLabel: {
    fontSize: 16, fontWeight: '600', color: '#333'
  },
  totalValue: {
    fontSize: 20, color: '#0057ff'
  },
  workCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2
  },
  workTitle: {
    fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 16
  },
  workRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  colorBar: {
    width: 4, height: 40, borderRadius: 2, marginRight: 12
  },
  workName: {
    fontSize: 15, fontWeight: '600', color: '#333'
  },
  period: {
    fontSize: 12, color: '#999'
  },
  amount: {
    fontSize: 15, fontWeight: '600', color: '#333'
  },
  hours: {
    fontSize: 12, color: '#777'
  },
  addRow: {
    flexDirection: 'row', alignItems: 'center'
  },
  addText: {
    color: '#555', fontSize: 14
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
