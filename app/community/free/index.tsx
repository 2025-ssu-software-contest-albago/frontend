import React from 'react';
import { View } from 'react-native';
import CommunityHeader from '../../components/CommunityHeader';

export default function FreeBoardScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <CommunityHeader />
      {/* 자유게시판 내용 */}
    </View>
  );
}