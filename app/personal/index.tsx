import Topbar from '@/components/common/Topbar';
import Month from '@/components/personal/month';
import Week from '@/components/personal/week';
import WeekEdit from '@/components/personal/weekEdit';
import { useCalTypeStore } from '@/scripts/store/personalStore';
import React, { useContext, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CalendarPager() {
  const [calendarWidth, setCalendarWidth] = useState(screenWidth);
  const calendarTypeBtn = useCalTypeStore((state) => state.type);
  const setCalType = useCalTypeStore((state) => state.setCalType);
  const bottomBarHeight = useContext(BottomTabBarHeightContext);

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
  },
  calendarTypeText: {
    fontSize: 15,
    color: "white",
  },
});
