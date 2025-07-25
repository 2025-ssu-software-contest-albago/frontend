import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useUserStore } from '@/scripts/store/userStore';
import { format, compareAsc } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TeamUserScheduleList() {
  const { memberId } = useLocalSearchParams();
  const { user } = useUserStore();

  const insets = useSafeAreaInsets();

  // 팀 & 멤버 찾기
  const teamSpace = user?.spaces?.find((s) => s.type === 'team');
  const member = teamSpace?.members?.find((m) => m.id === memberId);

  // 스케줄 찾기
  const schedules = teamSpace?.schedules?.filter((s) => s.memberId === memberId);

  // 미래 → 과거 순서
  const sorted = schedules?.sort((a, b) =>
    compareAsc(new Date(b.startTime), new Date(a.startTime))
  );

  // month별 그룹
  const grouped = {};
  sorted?.forEach((schedule) => {
    const monthKey = format(new Date(schedule.startTime), "yyyy-MM");
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push(schedule);
  });

  if (!member) {
    return (
      <View style={styles.center}>
        <Text>멤버를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{member.name}님의 근무 일정</Text>
        <View style={{ width: 24 }} /></View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {Object.keys(grouped).length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            등록된 스케줄이 없습니다.
          </Text>
        )}
        {Object.keys(grouped).map(monthKey => (
          <View key={monthKey} style={styles.weekSection}>
            <Text style={styles.weekTitle}>
              {format(new Date(monthKey + "-01"), "yyyy년 M월", { locale: ko })}
            </Text>
            {grouped[monthKey].map(schedule => (
              <View key={schedule.id} style={styles.scheduleCard}>
                <Text style={styles.scheduleDate}>
                  {format(new Date(schedule.startTime), "M월 d일 (eee)", { locale: ko })}
                </Text>
                <Text style={styles.scheduleTime}>
                  {format(new Date(schedule.startTime), "HH:mm")} ~ {format(new Date(schedule.endTime), "HH:mm")}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fafbfc', padding: 16
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16
  },
  headerTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#222'
  },
  weekSection: {
    marginBottom: 24
  },
  weekTitle: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#444'
  },
  scheduleCard: {
    backgroundColor: 'white', borderRadius: 8,
    padding: 12, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 3, elevation: 1
  },
  scheduleDate: {
    fontSize: 15, fontWeight: '600', color: '#333'
  },
  scheduleTime: {
    fontSize: 14, color: '#666', marginTop: 4
  },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  }
});
