import React from 'react';
import { View } from 'react-native';
import CommunityHeader from '../../components/CommunityHeader';

export default function PopularPostDetailScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <CommunityHeader />
      {/* 인기게시글 상세 내용 */}
    </View>
  );
}