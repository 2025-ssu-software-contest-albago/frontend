// personal/settings.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // 상단/하단 safe area를 위해

// 필요하다면 ColorScheme 훅이나 Constants 임포트
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Colors } from '@/constants/Colors';

export default function Appsettings() {
  // 예시를 위한 상태
  const [receiveNotifications, setReceiveNotifications] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  // 실제 앱에서는 여기에 사용자 설정 값을 불러오고 저장하는 로직이 들어갑니다.
  // 예: AsyncStorage, Context API, Redux Toolkit, React Query 등 사용

  const handleLogout = () => {
    // 로그아웃 로직 구현
    console.log('로그아웃 버튼 클릭');
    // 예: 토큰 삭제 후 로그인 화면으로 리다이렉트
    // router.replace('/login'); // expo-router의 router 사용
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>설정</Text>

        {/* 알림 설정 */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>알림 받기</Text>
          <Switch
            onValueChange={setReceiveNotifications}
            value={receiveNotifications}
            // trackColor={{ false: Colors.light.secondaryText, true: Colors.light.tint }}
            // thumbColor={receiveNotifications ? Colors.light.background : Colors.light.primaryText}
          />
        </View>

        {/* 다크 모드 설정 (useColorScheme 훅과 연동) */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>다크 모드</Text>
          <Switch
            onValueChange={setDarkModeEnabled}
            value={darkModeEnabled}
          />
        </View>

        {/* 기타 설정 항목 */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>개인 정보 보호 정책</Text>
          <Button title="보기" onPress={() => console.log('개인 정보 보호 정책 보기')} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>서비스 이용 약관</Text>
          <Button title="보기" onPress={() => console.log('서비스 이용 약관 보기')} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>버전 정보</Text>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>

        {/* 로그아웃 버튼 */}
        <View style={styles.logoutButtonContainer}>
          <Button title="로그아웃" onPress={handleLogout} color="red" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // 배경색
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingText: {
    fontSize: 18,
    color: '#555',
  },
  versionText: {
    fontSize: 16,
    color: '#888',
  },
  logoutButtonContainer: {
    marginTop: 30,
    // 원하는 스타일 추가 (예: 버튼 중앙 정렬)
  }
});