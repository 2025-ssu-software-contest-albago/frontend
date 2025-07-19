import { Slot, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { LogBox, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PostProvider } from './contexts/PostContext';

// 특정 경고 무시 - 임시 해결책
LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component',
]);

export default function CommunityLayout() {
  const pathname = usePathname();
  const router = useRouter();
  
  // 현재 활성화된 탭 확인
  const isFreePage = pathname.includes('/community/free');
  const isPopularPage = pathname.includes('/community/popular');
  
  // 탭 전환 핸들러
  const navigateToFree = () => {
    router.push('/community/free');
  };
  
  const navigateToPopular = () => {
    router.push('/community/popular');
  };

  return (
    <PostProvider>
      <View style={styles.container}>
        {/* 커스텀 탭 헤더 - 직접 구현 */}
        <View style={styles.tabHeader}>
          <TouchableOpacity 
            style={[styles.tabButton, isFreePage && styles.activeTab]}
            onPress={navigateToFree}
          >
            <Text style={[styles.tabText, isFreePage && styles.activeText]}>자유게시판</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, isPopularPage && styles.activeTab]}
            onPress={navigateToPopular}
          >
            <Text style={[styles.tabText, isPopularPage && styles.activeText]}>인기게시판</Text>
          </TouchableOpacity>
        </View>

        {/* 내용 영역 - Slot을 사용하여 중첩 라우팅 처리 */}
        <Slot />
      </View>
    </PostProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888',
  },
  activeText: {
    color: '#1976d2',
    fontWeight: 'bold',
  }
});