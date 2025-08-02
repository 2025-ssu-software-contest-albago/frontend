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
  Keyboard, // <--- Keyboard 모듈 import
  TouchableWithoutFeedback, // <--- TouchableWithoutFeedback import
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddTeamSpace() {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);

  const router = useRouter();

  const handleAddMember = () => {
    console.log('멤버 추가 버튼 클릭');
  };

  const handleCreateTeamSpace = () => {
    console.log('팀 공간 생성하기 버튼 클릭');
    console.log('팀 이름:', teamName);
    console.log('추가된 멤버:', members);
    // 실제 팀 생성 API 호출 로직
  };

  return (
    // SafeAreaView를 TouchableWithoutFeedback으로 감쌉니다.
    // accessible={false}는 시각 장애인용 스크린 리더가 이 터치를 무시하게 하여 접근성을 유지합니다.
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>팀 공간 생성</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.container}>
          {/* 팀 이름 입력 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              팀 이름 <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="팀 이름을 입력해주세요"
              value={teamName}
              onChangeText={setTeamName}
              // 키보드에서 'Done' 또는 '확인' 버튼을 눌렀을 때도 키보드를 숨기려면 추가
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="done" // 키보드 버튼 텍스트 설정
            />
          </View>

          {/* 추가할 멤버 섹션 */}
          <View style={styles.inputSection}>
            <View style={styles.memberLabelContainer}>
              <Text style={styles.label}>추가할 멤버</Text>
              <TouchableOpacity>
                <Ionicons name="help-circle-outline" size={16} color="#B0B0B0" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={handleAddMember}
            >
              <Ionicons name="add" size={20} color="#757575" />
              <Text style={styles.addMemberButtonText}>멤버 추가하기</Text>
            </TouchableOpacity>
            {members.length > 0 && (
              <View style={styles.membersList}>
                {members.map((member, index) => (
                  <Text key={index} style={styles.memberItem}>
                    {member}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* 팀 공간 생성하기 버튼 */}
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
  memberLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addMemberButtonText: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 8,
  },
  membersList: {
    marginTop: 10,
  },
  memberItem: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
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