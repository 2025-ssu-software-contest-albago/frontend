import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userList } from '../scripts/dummyData/userList';
import { useUserStore } from '@/scripts/store/userStore'; // 경로에 맞게 조정

export default function AddTeamSpace() {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, setUser } = useUserStore();

  const router = useRouter();

  const handleCreateTeamSpace = () => {
    if (!teamName.trim()) return;

    const now = new Date().toISOString();
    const teamSpaceId = `teamSpace_${Date.now()}`;

    const defaultMemberProps = {
      hourlyWage: 10000,
      weeklyAllowance: false,
      nightAllowance: false,
      nightRate: 150,
      overtimeAllowance: false,
      overtimeRate: 150,
      holidayAllowance: false,
      holidayRate: 150,
      deductions: "4대 보험"
    };

    const newTeamSpace = {
      id: teamSpaceId,
      type: "team",
      name: teamName.trim(),
      imageUrl: null,
      lastUpdatedAt: now,
      members: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: "admin",
          color: "lime",
          ...defaultMemberProps
        },
        ...members.map((m, i) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone || "",
          role: "member",
          color: i % 2 === 0 ? "mint" : "emerald", // 예시 색상 배정
          ...defaultMemberProps
        }))
      ],
      schedules: [] // 새 팀 생성 시 스케줄은 비어 있음
    };

    const updatedUserData = {
      ...user,
      spaces: [...user.spaces, newTeamSpace]
    };

    setUser(updatedUserData);
    console.log("✅ 팀 공간 생성됨:", newTeamSpace);
    console.log("📦 userStore 상태:", useUserStore.getState().user);
    router.push("/team"); // 이동 경로는 원하는 화면으로 변경
  };

  const handleSelectUser = (user) => {
    if (!members.find((m) => m.id === user.id)) {
      setMembers((prev) => [...prev, user]);
      setSearchQuery('');
      Keyboard.dismiss();
    }
  };

  const filteredUsers =
    searchQuery.trim().length < 2
      ? []
      : userList.filter((user) => {
        const keyword = searchQuery.trim().toLowerCase();
        const email = user.email.toLowerCase();

        return email.startsWith(keyword) || email.includes(keyword);
      });



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>팀 공간 생성</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.container}>
          {/* 팀 이름 입력 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              팀 이름 <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="팀 이름을 입력해주세요"
              value={teamName}
              onChangeText={setTeamName}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="done"
            />
          </View>

          {/* 팀원 추가하기 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>팀원 추가하기</Text>

            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="이메일로 검색하세요"
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {searchQuery.length > 0 && (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.searchResultItem}>
                    <View>
                      <Text style={styles.userEmail}>{item.email}</Text>
                      <Text style={styles.userName}>{item.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleSelectUser(item)}
                    >
                      <Text style={styles.addButtonText}>추가</Text>
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.searchResultList}
              />
            )}
          </View>

          {/* 추가된 팀원 */}
          <View style={styles.inputSection}>
            <View style={styles.memberLabelContainer}>
              <Text style={styles.label}>추가된 팀원</Text>
              <TouchableOpacity>
                <Ionicons name="help-circle-outline" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            </View>

            {members.length > 0 ? (
              <View style={styles.cardContainer}>
                {members.map((member) => (
                  <View key={member.id} style={styles.memberCard}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: '#999' }}>추가된 팀원이 없습니다.</Text>
            )}
          </View>

          {/* 하단 버튼 */}
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTeamSpace}
              disabled={!teamName.trim()}
            >
              <Text style={styles.createButtonText}>팀 공간 생성하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 24,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  requiredIndicator: {
    color: '#F44336',
    marginLeft: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
    fontSize: 16,
    color: '#333333',
  },
  searchBox: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0,
  },
  searchResultList: {
    marginTop: 8,
    maxHeight: 180,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  userEmail: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  userName: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#4285F4',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  memberCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 13,
    color: '#666',
  },
  bottomButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  createButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
