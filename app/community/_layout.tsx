import { Stack, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PostProvider } from './contexts/PostContext';

export default function CommunityLayout() {
  const pathname = usePathname();
  const router = useRouter();
  
  const isFreePage = pathname.includes('/community/free');
  const isPopularPage = pathname.includes('/community/popular');

  return (
    <PostProvider>
      <View style={styles.container}>
        {/* 커스텀 탭 헤더 */}
        <View style={styles.tabHeader}>
          <TouchableOpacity 
            style={[styles.tabButton, isFreePage && styles.activeTab]} 
            onPress={() => router.push('/community/free')}
          >
            <Text style={[styles.tabText, isFreePage && styles.activeText]}>자유글</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, isPopularPage && styles.activeTab]} 
            onPress={() => router.push('/community/popular')}
          >
            <Text style={[styles.tabText, isPopularPage && styles.activeText]}>인기글</Text>
          </TouchableOpacity>
        </View>

        {/* 내용 영역 */}
        <Stack screenOptions={{ headerShown: false }} />
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