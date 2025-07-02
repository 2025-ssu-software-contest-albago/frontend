import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { useUserStore } from '@/scripts/store/userStore';
import { useCalTypeStore } from '@/scripts/store/personalStore';

import PagerView from 'react-native-pager-view';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import WeekPage from '@/components/personal/weekPage';

export default function WeekEdit() {
    const pagerRef = useRef(null);
    const [baseDate, setBaseDate] = useState(dayjs().startOf('week'));
    const [spaceModalVisible, setSpaceModalVisible] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState('스쿨피자');

    const user = useUserStore((state) => state.user);
    const selectedSpaceIndex = useUserStore((state) => state.selected_space);
    const spaces = user?.spaces[selectedSpaceIndex].workPlaces

    const calendarTypeBtn = useCalTypeStore((state) => state.type);
    const setCalType = useCalTypeStore((state) => state.setCalType);

    const hours = useMemo(() => Array.from({ length: 48 }, (_, i) => i * 0.5), []);

    const handlePageSelected = (e) => {
        const newPage = e.nativeEvent.position;
        const offset = newPage - 1;
        if (offset !== 0) {
            const newBase = baseDate.add(offset * 7, 'day');
            setTimeout(() => {
                setBaseDate(newBase);
                pagerRef.current?.setPageWithoutAnimation(1);
            }, 0);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, backgroundColor: "white" }}>
                {
                    calendarTypeBtn === '편집' &&
                    <Pressable onPress={() => setCalType('월')}>
                        <Text style={styles.closeIcon}>×</Text>
                    </Pressable>
                }
            </View>
            <PagerView
                ref={pagerRef}
                initialPage={1}
                onPageSelected={handlePageSelected}
                style={{ flex: 1 }}
            >
                <WeekPage
                    key="-1"
                    offset={-1}
                    baseDate={baseDate}
                    selectedSpace={selectedSpace}
                    setSpaceModalVisible={setSpaceModalVisible}
                    hours={hours}
                />
                <WeekPage
                    key="0"
                    offset={0}
                    baseDate={baseDate}
                    selectedSpace={selectedSpace}
                    setSpaceModalVisible={setSpaceModalVisible}
                    hours={hours}
                />
                <WeekPage
                    key="1"
                    offset={1}
                    baseDate={baseDate}
                    selectedSpace={selectedSpace}
                    setSpaceModalVisible={setSpaceModalVisible}
                    hours={hours}
                />
            </PagerView>

            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setSpaceModalVisible(true)}
            >
                <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownText}>{selectedSpace}</Text>
                    <Ionicons name="chevron-down" size={18} color="#555" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveText}>저장 하기</Text>
            </TouchableOpacity>

            <Modal
                isVisible={spaceModalVisible}
                onBackdropPress={() => setSpaceModalVisible(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.4}
                style={{ margin: 0, justifyContent: 'flex-end' }}
            >
                <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    {spaces.map((space, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setSelectedSpace(space.name);
                                setSpaceModalVisible(false);
                            }}
                            style={{ paddingVertical: 10 }}
                        >
                            <Text>{space.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
    },
    dropdownContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: { fontSize: 14, color: '#000' },
    saveButton: {
        backgroundColor: '#3399ff',
        padding: 12,
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 6,
    },
    saveText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    closeIcon: {
        fontSize: 24,
        color: 'red',
        fontWeight: 'bold',
        marginRight: 8,
    },
});

