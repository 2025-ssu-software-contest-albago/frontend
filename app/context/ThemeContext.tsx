// context/ThemeContext.tsx

/*import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Appearance } from 'react-native'; // 기기 시스템 설정 읽기 (초기값 설정용)
//import AsyncStorage from '@react-native-async-storage/async-storage'; // 테마 설정을 저장하고 불러오기 위해

// 1. AsyncStorage 설치 확인
// 아직 설치 안 되어 있다면, 터미널에서 다음 명령어를 실행해주세요:
// npx expo install @react-native-async-storage/async-storage

// 2. 테마 모드 타입 정의
export type ThemeMode = 'light' | 'dark';

// 3. Theme Context가 제공할 값의 타입 정의
interface ThemeContextType {
  theme: ThemeMode; // 현재 테마 모드 ('light' 또는 'dark')
  toggleTheme: () => void; // 테마를 토글하는 함수
  setTheme: (mode: ThemeMode) => void; // 특정 테마로 설정하는 함수
}

// 4. Context 생성
// Context의 초기값은 undefined로 설정하고, useAppTheme 훅에서 undefined 여부를 체크합니다.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 5. Theme Provider 컴포넌트 정의
interface ThemeProviderProps {
  children: ReactNode; // 이 Provider가 감싸는 자식 컴포넌트들
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // 테마 상태: 초기값은 'light'로 설정하되, AsyncStorage에서 저장된 값을 불러와 적용할 것입니다.
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('light');

  // 컴포넌트가 마운트될 때 (앱 시작 시) 저장된 테마를 불러오거나 시스템 설정을 읽어옵니다.
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          // AsyncStorage에 저장된 테마가 있다면 그 값을 사용
          setCurrentTheme(savedTheme);
        } else {
          // 저장된 테마가 없으면, 기기의 현재 시스템 색상 스키마를 따름
          // (사용자가 앱 내 테마를 한 번도 설정하지 않았을 경우)
          const systemColorScheme = Appearance.getColorScheme();
          setCurrentTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
        }
      } catch (e) {
        // 오류 발생 시 콘솔에 로그 출력 후 기본값 'light' 또는 시스템 설정 따름
        console.error("Failed to load theme from AsyncStorage", e);
        const systemColorScheme = Appearance.getColorScheme();
        setCurrentTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, []); // 마운트될 때 한 번만 실행

  // 테마를 특정 모드로 설정하고 AsyncStorage에 저장하는 함수
  const setTheme = async (mode: ThemeMode) => {
    setCurrentTheme(mode); // 현재 상태 업데이트
    try {
      await AsyncStorage.setItem('appTheme', mode); // AsyncStorage에 저장
    } catch (e) {
      console.error("Failed to save theme to AsyncStorage", e);
    }
  };

  // 현재 테마를 토글하는 함수 (light <-> dark)
  const toggleTheme = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  // Context.Provider에 전달할 값
  const contextValue: ThemeContextType = {
    theme: currentTheme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 6. 커스텀 훅 정의: 다른 컴포넌트에서 테마 Context 값을 쉽게 사용하기 위해
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  // Context가 Provider로 감싸져 있지 않으면 에러 발생 (잘못된 사용 방지)
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};*/