import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';  // npm i @react-native-picker/picker
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserStore } from '@/scripts/store/userStore';

import ColorPickerModal from '../../components/common/ColorPickerModal'; // 경로에 맞게 수정
import { scheduleColors } from '../../scripts/color/scheduleColor'

export default function TeamUserDetailEdit() {
    const { memberId } = useLocalSearchParams();
    const { user, setUser } = useUserStore();

    const [member, setMember] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [color, setColor] = useState('');
    const [role, setRole] = useState('');
    const [hourlyWage, setHourlyWage] = useState('');

    const [weeklyAllowance, setWeeklyAllowance] = useState(false);
    const [nightAllowance, setNightAllowance] = useState(false);
    const [nightRate, setNightRate] = useState('');
    const [overtimeAllowance, setOvertimeAllowance] = useState(false);
    const [overtimeRate, setOvertimeRate] = useState('');
    const [holidayAllowance, setHolidayAllowance] = useState(false);
    const [holidayRate, setHolidayRate] = useState('');

    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!user) return;
        const teamSpace = user.spaces.find((s) => s.type === 'team');
        const foundMember = teamSpace?.members.find((m) => m.id === memberId);
        if (foundMember) {
            setMember(foundMember);
            setName(foundMember.name || '');
            setEmail(foundMember.email || '');
            setPhone(foundMember.phone || '');
            setColor(foundMember.color || '');
            setRole(foundMember.role || '');
            setHourlyWage(String(foundMember.hourlyWage || ''));
            setWeeklyAllowance(foundMember.weeklyAllowance);
            setNightAllowance(foundMember.nightAllowance);
            setNightRate(String(foundMember.nightRate || '150'));
            setOvertimeAllowance(foundMember.overtimeAllowance);
            setOvertimeRate(String(foundMember.overtimeRate || '150'));
            setHolidayAllowance(foundMember.holidayAllowance);
            setHolidayRate(String(foundMember.holidayRate || '150'));
        }
    }, [user, memberId]);

    const [colorModalVisible, setColorModalVisible] = useState(false);

    const handleSave = () => {
        if (!user) return;
        const teamSpace = user.spaces.find((s) => s.type === 'team');
        const updatedMembers = teamSpace.members.map((m) =>
            m.id === memberId
                ? {
                    ...m,
                    color,
                    role,
                    hourlyWage: parseInt(hourlyWage) || 0,
                    weeklyAllowance,
                    nightAllowance,
                    nightRate: parseInt(nightRate) || 150,
                    overtimeAllowance,
                    overtimeRate: parseInt(overtimeRate) || 150,
                    holidayAllowance,
                    holidayRate: parseInt(holidayRate) || 150
                }
                : m
        );
        const updatedSpaces = user.spaces.map((s) =>
            s.type === 'team' ? { ...s, members: updatedMembers } : s
        );
        setUser({ ...user, spaces: updatedSpaces });
        if (Platform.OS === 'android') {
            ToastAndroid.show("저장되었습니다.", ToastAndroid.SHORT);
        } else {
            Alert.alert("저장되었습니다.");
        }
        router.back();
    };

    const handleDelete = () => {
        if (!user) return;
        const teamSpace = user.spaces.find((s) => s.type === 'team');
        const updatedMembers = teamSpace.members.filter((m) => m.id !== memberId);
        const updatedSpaces = user.spaces.map((s) =>
            s.type === 'team' ? { ...s, members: updatedMembers } : s
        );
        setUser({ ...user, spaces: updatedSpaces });
        router.back();
    };

    if (!member) {
        return <View style={styles.center}><Text>멤버 정보를 불러오는 중...</Text></View>
    }

    return (
        <View style={[{ flex: 1 }, { paddingTop: insets.top }]}>
            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={22} color="#222" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>사용자 정보</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.editBtn}>저장</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>개인 정보</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>이름</Text>
                        <Text style={styles.readonly}>{name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>이메일</Text>
                        <Text style={styles.readonly}>{email || '-'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>전화번호</Text>
                        <Text style={styles.readonly}>{phone || '-'}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>색상</Text>
                        <TouchableOpacity onPress={() => setColorModalVisible(true)} style={styles.colorBox}>
                            <View style={[styles.colorDot, { backgroundColor: color }]} />
                            <Feather name="chevron-down" size={18} color="#555" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>직급</Text>
                        <View style={{ width: 150 }}>
                            <Picker
                                selectedValue={role}
                                onValueChange={(itemValue) => setRole(itemValue)}
                                mode="dropdown"
                            >
                                <Picker.Item label="관리자" value="admin" />
                                <Picker.Item label="직원" value="member" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>시급</Text>
                        <TextInput style={styles.input} value={hourlyWage} onChangeText={setHourlyWage} keyboardType="number-pad" />
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.switchRow}>
                        <Text style={styles.label}>주휴 수당 적용</Text>
                        <Switch value={weeklyAllowance} onValueChange={setWeeklyAllowance} />
                    </View>
                    <View style={styles.switchRow}>
                        <Text style={styles.label}>야간 수당</Text>
                        <Switch value={nightAllowance} onValueChange={setNightAllowance} />
                    </View>
                    {nightAllowance && (
                        <TextInput style={styles.rateInput} value={nightRate} onChangeText={setNightRate} keyboardType="number-pad" placeholder="150%" />
                    )}
                    <View style={styles.switchRow}>
                        <Text style={styles.label}>연장 수당</Text>
                        <Switch value={overtimeAllowance} onValueChange={setOvertimeAllowance} />
                    </View>
                    {overtimeAllowance && (
                        <TextInput style={styles.rateInput} value={overtimeRate} onChangeText={setOvertimeRate} keyboardType="number-pad" placeholder="150%" />
                    )}
                    <View style={styles.switchRow}>
                        <Text style={styles.label}>휴일 수당</Text>
                        <Switch value={holidayAllowance} onValueChange={setHolidayAllowance} />
                    </View>
                    {holidayAllowance && (
                        <TextInput style={styles.rateInput} value={holidayRate} onChangeText={setHolidayRate} keyboardType="number-pad" placeholder="150%" />
                    )}
                </View>

                <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>팀원 삭제하기</Text>
                </TouchableOpacity>
            </ScrollView>
            <ColorPickerModal
                visible={colorModalVisible}
                onClose={() => setColorModalVisible(false)}
                onSelect={(colorName) => {
                    setColor(scheduleColors[colorName].main);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fafbfc', padding: 16 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginHorizontal: 5, marginBottom: 16
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    editBtn: { color: '#007AFF', fontSize: 16 },
    card: {
        backgroundColor: 'white', borderRadius: 12, padding: 16,
        marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04,
        shadowRadius: 4, elevation: 1,
    },
    sectionTitle: { color: '#888', fontSize: 13, marginBottom: 10 },
    row: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 12
    },
    label: { color: '#222', fontSize: 15 },
    readonly: {
        paddingVertical: 8, minWidth: 150,
        textAlign: 'right', color: '#222', fontSize: 15
    },
    input: {
        borderBottomWidth: 1, borderColor: '#ddd',
        paddingVertical: 8, minWidth: 150,
        textAlign: 'right', fontSize: 15, color: '#222'
    },
    colorDot: { width: 20, height: 20, borderRadius: 10 },
    switchRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginVertical: 8
    },
    rateInput: {
        borderBottomWidth: 1, borderColor: '#ddd',
        paddingVertical: 8, width: 100, alignSelf: 'flex-end',
        textAlign: 'right', fontSize: 15, color: '#222'
    },
    deleteBtn: {
        backgroundColor: '#FF3B30', padding: 16, borderRadius: 12,
        alignItems: 'center', marginBottom: 150, margin: 16
    },
    deleteText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    colorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
        elevation: 1, // Android shadow
        gap: 8,
    },
});
