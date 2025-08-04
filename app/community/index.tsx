import { Redirect } from 'expo-router';
import React from 'react';

// 이렇게 하면 Expo Router가 이 파일을 라우트로 인식하지 않습니다
export default function Index() {
  return <Redirect href="/community/free" />;
}