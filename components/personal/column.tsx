import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';

interface ColumnProps {
  columnIndex: number;
  hours: number[];
  CELL_WIDTH: number;
}

const ROW_HEIGHT = 30;

const Column: React.FC<ColumnProps> = ({ columnIndex, hours, CELL_WIDTH }) => {
  /* ---------- JS 상태 ---------- */
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  /** 셀을 토글하는 순수 JS 함수 */
  const toggleRow = (idx: number) => {
    setSelectedRows(prev =>
      prev.includes(idx) ? prev.filter(v => v !== idx) : [...prev, idx],
    );
  };

  /* ---------- UI-스레드용 SharedValue ---------- */
  const lastRowSV = useSharedValue(-1);      // 직전에 처리한 행 인덱스

  /* ---------- 제스처 ---------- */
  const gesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onStart(e => {
      'worklet';
      const r = Math.floor(e.y / ROW_HEIGHT);
      if (r < 0 || r >= hours.length) return;

      lastRowSV.value = r;                   // 중복 방지용 업데이트
      runOnJS(toggleRow)(r);                 // 토글 실행
    })
    .onUpdate(e => {
      'worklet';
      const r = Math.floor(e.y / ROW_HEIGHT);
      if (r < 0 || r >= hours.length) return;
      if (r === lastRowSV.value) return;     // 같은 셀이면 무시

      lastRowSV.value = r;
      runOnJS(toggleRow)(r);                 // 새 셀 → 토글
    })
    .onEnd(() => {
      'worklet';
      lastRowSV.value = -1;                  // 초기화
    });

  /* ---------- 렌더 ---------- */
  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.column}>
        {hours.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.cell,
              {
                width:  CELL_WIDTH,
                height: ROW_HEIGHT,
                borderRightWidth: columnIndex === 6 ? 0 : 0.2,
                backgroundColor: selectedRows.includes(idx)
                  ? '#99ccff'
                  : 'transparent',
              },
            ]}
          />
        ))}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  column: { flexDirection: 'column' },
  cell: {
    borderTopWidth:    0.2,
    borderLeftWidth:   0.2,
    borderBottomWidth: 0.2,
    borderColor:       '#ccc',
  },
});

export default React.memo(Column);
