import { Stack } from 'expo-router';
import React from 'react';

export default function FreeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}