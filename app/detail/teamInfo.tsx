import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useUserStore } from '@/scripts/store/userStore';
import { WebView } from 'react-native-webview';
import { scheduleColors } from '@/scripts/color/scheduleColor';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function TeamSpaceInfoScreen() {
    const { user, selected_space } = useUserStore();
    const teamSpace = user?.spaces[selected_space];
    const router = useRouter();
    const insets = useSafeAreaInsets(); // ✅ 여기 추가

    if (!teamSpace) return <Text>팀 공간 정보를 불러오는 중...</Text>;

    const { name, members, location } = teamSpace;

    const mapHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
      #map {
        width: 100%;
        height: 100vh;
        min-height: 360px;
      }
      .label {
        background: white;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 13px;
        color: #333;
        box-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        white-space: nowrap;
      }
    </style>
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=5bc2c2c9222ca281718b0d6e5d8d8cf6&autoload=false"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      kakao.maps.load(function () {
        var container = document.getElementById('map');
        var options = {
          center: new kakao.maps.LatLng(${location.lat}, ${location.lng}),
          level: 1
        };

        var map = new kakao.maps.Map(container, options);

        // 마커 생성
        var markerPosition = new kakao.maps.LatLng(${location.lat}, ${location.lng});
        var marker = new kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);

        // ✅ 깔끔한 오버레이로 "내 매장 위치" 표시
        const overlayContent = '<div style="background: #4285f4; color: white; padding: 15px 15px; border-radius: 6px; font-size: 30px;">내 매장 위치</div>';
        const customOverlay = new kakao.maps.CustomOverlay({
            content: overlayContent,
            position: markerPosition,
            yAnchor: 1.5
        });
        customOverlay.setMap(map);
      });
    </script>
  </body>
</html>
`;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="chevron-left" size={28} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>팀 공간 정보</Text>
                </View>
                {/* 오른쪽 빈 공간 맞추기용 */}
                <View style={{ width: 28 }} />
            </View>
            <Text style={styles.title}>{name}</Text>

            <Text style={styles.subtitle}>구성원</Text>
            <FlatList
                data={members}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.memberRow}>
                        <View style={[styles.colorDot, { backgroundColor: scheduleColors[item.color].main || '#999' }]} />
                        <Text style={styles.memberName}>
                            {item.name}
                            {item.role === 'admin' && <Text style={styles.adminInline}>  관리자</Text>}
                        </Text>
                    </View>
                )}
            />

            <Text style={styles.subtitle}>매장 위치</Text>
            <View style={styles.mapContainer}>
                <WebView
                    source={{ html: mapHtml }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    originWhitelist={['*']}
                    mixedContentMode="always"
                    onMessage={(event) => {
                        console.log('[📡 WebView]', event.nativeEvent.data);
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    subtitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    backButton: {
        paddingHorizontal: 4,
        paddingVertical: 6,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    mapContainer: {
        height: screenHeight * 0.3,
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    backButton: {
        paddingHorizontal: 0,
        paddingVertical: 6,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    memberName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    adminInline: {
        fontSize: 16,
        fontWeight: '400',
        color: '#007AFF',
    },
    roleLabel: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
        marginTop: 2,
    },
});
