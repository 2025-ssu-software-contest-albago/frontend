// components/personal/Column.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface ColumnProps {
  columnIndex: number;
  hours: number[];
  CELL_WIDTH: number;
}

const Column: React.FC<ColumnProps> = ({ columnIndex, hours, CELL_WIDTH }) => {
  return (
    <View style={styles.column}>
      {hours.map((_, rowIdx) => (
        <TouchableOpacity
          key={rowIdx}
          style={[
            styles.cell,
            {
              width: CELL_WIDTH,
              height: 30,
              borderRightWidth: columnIndex === 6 ? 0 : 0.2,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  cell: {
    borderTopWidth: 0.2,
    borderLeftWidth: 0.2,
    borderBottomWidth: 0.2,
    borderColor: '#ccc',
  },
});

export default React.memo(Column);