import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../scripts/store/userStore'; // 예시 import

export default function MyProfile() {
  const user = useUserStore(state => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 정보</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>이름</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>전화번호</Text>
        <Text style={styles.value}>{user.phone}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>이메일</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  label: { fontSize: 16, color: '#555' },
  value: { fontSize: 16, color: '#000' },
});
