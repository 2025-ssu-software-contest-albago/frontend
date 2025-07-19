import Topbar from '@/components/common/Topbar';
import Month from '@/components/team/month';
import Week from '@/components/team/Week';
import WeekEdit from '@/components/team/weekEdit';
import { useCalTypeStore } from '@/scripts/store/teamStore';
import React, { useContext, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useUserStore } from '@/scripts/store/userStore';
import { Feather } from '@expo/vector-icons';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import Modal from 'react-native-modal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CalendarPager() {
  const [calendarWidth, setCalendarWidth] = useState(screenWidth);
  const calendarTypeBtn = useCalTypeStore((state) => state.type);
  const setCalType = useCalTypeStore((state) => state.setCalType);

  const bottomBarHeight = useContext(BottomTabBarHeightContext);

  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [teamInfoModalVisible, setTeamInfoModalVisible] = useState(false);
  const [nextAction, setNextAction] = useState<null | (() => void)>(null);
  const user = useUserStore((state) => state.user);
  const selectedSpaceId = useUserStore((state) => state.selected_space);
  const router = useRouter();

  return (
    <View
      style={[{ flex: 1 },
      Platform.OS === 'ios' ? { marginBottom: bottomBarHeight } : null
      ]}
    >
      <Topbar></Topbar>
      {
        calendarTypeBtn === '월' ? <Month />
          : calendarTypeBtn === '주' ? <Week />
            : <WeekEdit />
      }
      {
        calendarTypeBtn === "편집" ?
          null
          :
          <>
            <Pressable
              style={({ pressed }) => [
                styles.calendarTypeBtn,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => calendarTypeBtn === '월' ? setCalType("주") : setCalType("월")}
            >
              <Text style={styles.calendarTypeText}>
                {calendarTypeBtn}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.rightbottomMenuBtn,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => setMenuModalVisible(true)}
            >
              <Feather name="menu" size={24} color="white" />
            </Pressable>
            <Modal
              isVisible={menuModalVisible}
              onBackdropPress={() => setMenuModalVisible(false)}
              onModalHide={() => {
                if (nextAction) {
                  console.log("▶ nextAction 실행");
                  nextAction();
                  setNextAction(null);
                }
              }}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              backdropOpacity={0.4}
              style={{ margin: 0, justifyContent: 'flex-end' }}
            >
              <View style={styles.menuModalContent}>
                <Text style={styles.menuHeader}>메뉴</Text>
                <Pressable onPress={() => {
                  setNextAction(() => () => setTeamInfoModalVisible(true));
                  setMenuModalVisible(false);
                }} style={styles.menuItem}>
                  <Feather name="users" size={24} color="#333" />
                  <Text style={styles.menuText}>팀원 정보</Text>
                </Pressable>
                <View style={styles.menuItem}><Feather name="clock" size={24} color="#333" /><Text style={styles.menuText}>출/퇴근 관리</Text></View>
                <TouchableOpacity onPress={() => {
                  router.push(`/handover`);
                  setMenuModalVisible(false);
                }}>
                  <View style={styles.menuItem}><Feather name="repeat" size={24} color="#333" /><Text style={styles.menuText}>인수인계</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  router.push(`/memo`);
                  setMenuModalVisible(false);
                }}>
                  <View style={styles.menuItem}><Feather name="edit-2" size={24} color="#333" /><Text style={styles.menuText}>개인 메모</Text></View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    router.push('/community');
                    setMenuModalVisible(false); // 모달 닫기
                  }}
                >
                  <View style={styles.menuItem}>
                    <Feather name="message-square" size={24} color="#333" />
                    <Text style={styles.menuText}>자유게시판</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
            {/* 팀원 정보 모달 */}
            <Modal
              isVisible={teamInfoModalVisible}
              onBackdropPress={() => setTeamInfoModalVisible(false)}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              backdropOpacity={0.4}
              style={{ margin: 0, justifyContent: 'flex-end' }}
            >
              <View style={styles.teamInfoModalContent}>
                <Text style={styles.teamInfoHeader}>팀원 정보</Text>
                {user?.spaces?.find((s: any) => s.type === 'team')?.members?.map((member: any, idx: number) => (
                  <View key={member.id} style={styles.teamMemberRow}>
                    <View style={[styles.colorBar, { backgroundColor: member.color || '#ccc' }]} />
                    <Text style={styles.memberName}>{member.name}</Text>
                    {member.role === "admin" && <Text style={styles.managerLabel}>관리자</Text>}
                    <View style={styles.memberIcons}>
                      <TouchableOpacity onPress={() => {
                        setTeamInfoModalVisible(false);
                        router.push(`/detail/teamUserDetail?memberId=${member.id}`);
                      }}>
                        <Feather name="user" size={22} color="#222" />
                      </TouchableOpacity>
                      <Feather name="repeat" size={22} color="#222" style={{ marginLeft: 18 }} />
                      <TouchableOpacity onPress={() => {
                        router.push(`/detail/teamUserScheduleList?memberId=${member.id}`);
                      }}>
                        <Feather name="calendar" size={22} color="#222" style={{ marginLeft: 18 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </Modal>
          </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff', //배경색 다크모드와 라이트 모드 생각해서 좀 잘 짜야 할 듯? 
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  todayBtn: {
    fontSize: 14,
    color: '#666',
  },
  weekRow: {
    flexDirection: 'row',
    paddingBottom: 4,
    paddingTop: 8,
  },
  weekday: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#666',
  },
  dateGrid: {
    flexDirection: 'column',
  },
  dateRow: {
    flexDirection: 'row',
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  dateCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthContainer: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  calendarTypeBtn: {
    position: 'absolute',
    bottom: 24,           // 하단 여백
    right: 24,            // 우측 여백
    width: '12%',            // 버튼 크기
    aspectRatio: '1/1',
    borderRadius: 25,     // 완전한 원
    backgroundColor: '#007AFF',  // iOS 스타일 파란색
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,         // 안드로이드 그림자
    zIndex: 5,
  },
  calendarTypeText: {
    fontSize: 15,
    color: "white",
  },
  rightbottomMenuBtn: {
    position: 'absolute',
    bottom: 24,
    right: 85,
    width: '12%',
    aspectRatio: '1/1',
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    zIndex: 5,
  },
  menuModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  menuHeader: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 16,
    color: '#222',
  },
  teamInfoModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    minHeight: 350,
  },
  teamInfoHeader: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  teamMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginLeft: 4,
  },
  colorBar: {
    width: 6,
    height: 24, // 기존 32 → 24로 줄임
    borderRadius: 3,
    marginRight: 8, // 기존 10 → 8로 줄임
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 8,
    // minWidth: 70,
    // lineHeight: 24, // 추가: colorBar와 높이 맞춤
  },
  managerLabel: {
    color: '#3CB371',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 10,
  },
  memberIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  // CommunityHeader 관련 스타일 추가
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50, // 상태바 높이 고려
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
    color: '#222',
  },
});
