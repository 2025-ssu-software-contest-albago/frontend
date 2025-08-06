import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AttendanceMainScreen() {
  const router = useRouter();
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hour}:${min}`;
    setCheckInTime(timeStr);
    alert(`${timeStr}  출근이 기록되었습니다! `);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hour}:${min}`;
    setCheckOutTime(timeStr);
    alert(`${timeStr}  퇴근이 기록되었습니다! `);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>출퇴근 관리</Text>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={handleCheckIn}
      >
        <Text style={styles.menuText}>출근하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={handleCheckOut}
      >
        <Text style={styles.menuText}>퇴근하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/attendance/history')}
      >
        <Text style={styles.menuText}>출퇴근 기록</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/attendance/stat')}
      >
        <Text style={styles.menuText}>근태 통계</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/attendance/admin')}
      >
        <Text style={styles.menuText}>관리자용 전체 현황</Text>
      </TouchableOpacity>
      {/* 기록된 시간 간단 표시 (옵션) */}
      {checkInTime && (
        <Text style={{ marginTop: 10, color: '#1976d2' }}>마지막 출근: {checkInTime}</Text>
      )}
      {checkOutTime && (
        <Text style={{ color: '#1976d2' }}>마지막 퇴근: {checkOutTime}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    marginTop: 8,
  },
  menuButton: {
    backgroundColor: '#007AFF',
    height: 60,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 24,
  },
  menuText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});