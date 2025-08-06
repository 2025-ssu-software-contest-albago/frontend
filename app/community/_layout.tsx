import { AntDesign } from '@expo/vector-icons';
import { Slot, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { LogBox, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PostProvider } from './contexts/PostContext';

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component',
]);

export default function CommunityLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const isFreePage = pathname.includes('/community/free');
  const isPopularPage = pathname.includes('/community/popular');

  const navigateToFree = () => {
    router.push('/community/free');
  };

  const navigateToPopular = () => {
    router.push('/community/popular');
  };

  return (
    <PostProvider>
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>커뮤니티</Text>
        </View>
        {/* 커스텀 탭 헤더 */}
        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={[styles.tabButton, isFreePage && styles.activeTab]}
            onPress={navigateToFree}
          >
            <Text style={[styles.tabText, isFreePage && styles.activeText]}>자유 게시판</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, isPopularPage && styles.activeTab]}
            onPress={navigateToPopular}
          >
            <Text style={[styles.tabText, isPopularPage && styles.activeText]}>인기 게시판</Text>
          </TouchableOpacity>
        </View>
        {/* 내용 영역 */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 10,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
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