import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AttendanceEditScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>출퇴근 기록 수정 요청 기능은 현재 제공하지 않습니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#888', textAlign: 'center' },
});