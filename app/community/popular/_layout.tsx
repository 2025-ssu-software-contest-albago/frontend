import { Stack } from 'expo-router';

export default function PopularBoardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 상위 레이아웃의 탭과 충돌하지 않도록 헤더 숨김
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#f8f8f8' },
      }}
    />
  );
}