// app/personal/(detail)/_layout.tsx
import { Stack } from 'expo-router';

export default function DetailStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="personalScheduleDetail" // 이 폴더 내의 scheduleDetail.tsx 파일을 가리킵니다.
        options={{
          headerShown: false, // ScheduleDetail 컴포넌트 내부에서 헤더를 그릴 것이므로 숨깁니다.
        }}
      />
    </Stack>
  );
}