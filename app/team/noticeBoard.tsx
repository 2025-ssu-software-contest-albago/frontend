// team/noticeBoard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'; // AntDesign 임포트

// 화면 너비를 가져와 동적인 스타일링에 사용
const { width } = Dimensions.get('window');

// 게시물 데이터 타입 정의
interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
}

// 임시 데이터 (공지사항)
const noticeData: Post[] = [
  { id: '1', title: '점검 안내 (2025년 7월 5일)', date: '2025-07-01', content: '시스템 안정화를 위한 정기 점검이 있습니다.' },
  { id: '2', title: '새로운 기능 업데이트!', date: '2025-06-28', content: '팀 스케줄 기능이 추가되었습니다.' },
  { id: '3', title: '이용 약관 변경 안내', date: '2025-06-20', content: '개정된 이용 약관을 확인해주세요.' },
  { id: '4', title: '서비스 개선을 위한 설문조사', date: '2025-06-15', content: '설문조사에 참여하시고 커피쿠폰을 받으세요!' },
  { id: '5', title: '공지사항 5', date: '2025-06-10', content: '다섯 번째 공지사항입니다.' },
];

// 임시 데이터 (건의사항)
const suggestionData: Post[] = [
  { id: '1', title: '건의사항: 알림 기능 개선 요청', date: '2025-07-03', content: '알림음 설정 기능이 필요합니다.' },
  { id: '2', title: '건의사항: 다크 모드 버그 제보', date: '2025-06-29', content: '특정 화면에서 다크 모드 적용이 이상합니다.' },
  { id: '3', title: '건의사항: 이미지 첨부 오류', date: '2025-06-25', content: '이미지 업로드 시 오류가 발생합니다.' },
  { id: '4', title: '건의사항 4', date: '2025-06-18', content: '네 번째 건의사항입니다.' },
  { id: '5', title: '건의사항 5', date: '2025-06-12', content: '다섯 번째 건의사항입니다.' },
];

export default function NoticeBoard() {
  const FIXED_COLORS = {
    background: '#f8f8f8',
    text: '#333',
    tabBackground: '#e0e0e0',
    tabInactiveText: '#666',
    tabActiveText: '#0a7ea4',
    tabActiveBorder: '#0a7ea4',
    postCardBg: '#fff',
    postCardBorder: '#eee',
    postTitleText: '#333',
    postDateText: '#888',
    shadowColor: '#000',
    tint: '#0a7ea4', // 핀 아이콘에 사용될 강조 색상
    fabBackground: '#0a7ea4',
    fabIconColor: '#fff',
  };

  const [activeTab, setActiveTab] = useState<'notice' | 'suggestion'>('notice');

  const dataToRender = activeTab === 'notice' ? noticeData : suggestionData;

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={[
        styles.postItem,
        {
          backgroundColor: FIXED_COLORS.postCardBg,
          borderColor: FIXED_COLORS.postCardBorder,
          ...Platform.select({
            ios: { shadowColor: FIXED_COLORS.shadowColor },
            android: {},
          })
        }
      ]}
      onPress={() => {
        console.log(`${item.title} 클릭됨`);
        // router.push(`/team/noticeBoard/${item.id}`);
      }}
    >
      {/* 핀 아이콘과 제목 텍스트를 감싸는 View 추가 */}
      <View style={styles.postTitleRow}>
        {activeTab === 'notice' && item.id === '1' && ( // 첫 번째 공지사항만 핀 고정 (예시)
          <AntDesign
            name="pushpino"
            size={20} // 아이콘 크기 (원하는 크기로 조절)
            color={FIXED_COLORS.tint}
            style={styles.pinIcon} // 수정된 pinIcon 스타일 적용
          />
        )}
        <Text style={[styles.postTitle, { color: FIXED_COLORS.postTitleText }]}>{item.title}</Text>
      </View>
      <Text style={[styles.postDate, { color: FIXED_COLORS.postDateText }]}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: FIXED_COLORS.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: FIXED_COLORS.text }]}>게시판</Text>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: FIXED_COLORS.tabBackground }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'notice' && styles.activeTabButton,
            activeTab === 'notice' && { borderBottomColor: FIXED_COLORS.tabActiveBorder }
          ]}
          onPress={() => setActiveTab('notice')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'notice' ? FIXED_COLORS.tabActiveText : FIXED_COLORS.tabInactiveText }
            ]}
          >
            공지사항
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'suggestion' && styles.activeTabButton,
            activeTab === 'suggestion' && { borderBottomColor: FIXED_COLORS.tabActiveBorder }
          ]}
          onPress={() => setActiveTab('suggestion')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'suggestion' ? FIXED_COLORS.tabActiveText : FIXED_COLORS.tabInactiveText }
            ]}
          >
            건의사항
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dataToRender}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />

      {/* 오른쪽 하단 플로팅 글쓰기 버튼 (FAB) */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: FIXED_COLORS.fabBackground }]}
        onPress={() => console.log('새 글 작성 버튼 클릭')}
      >
        <AntDesign name="pluscircleo" size={24} color={FIXED_COLORS.fabIconColor} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  postItem: {
    flexDirection: 'column', // <-- 이것은 전체 카드의 내용 배열 (제목, 날짜 등)을 세로로 정렬
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // 새로운 스타일 추가: 핀 아이콘과 제목을 감싸는 View
  postTitleRow: {
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 정렬
    alignItems: 'center', // 아이콘과 텍스트를 세로 중앙에 정렬
    marginBottom: 5, // 제목과 날짜 사이 간격 유지 (기존 postTitle의 marginBottom을 이쪽으로 옮김)
  },
  pinIcon: {
    color: '#FF0000', // 핀 아이콘 색상
    marginRight: 8, // 아이콘과 제목 텍스트 사이 간격
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 5, // <-- postTitleRow로 이동했으므로 제거
  },
  postDate: {
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        bottom: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        bottom: 100,
        elevation: 5,
      },
    }),
  },
});