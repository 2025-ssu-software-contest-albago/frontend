import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommunityHeader from '../../components/CommunityHeader';
import { usePostContext } from '../contexts/PostContext';

export default function FreePostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getPostById, getCommentsByPostId, togglePostLike, toggleCommentLike } = usePostContext();
  
  // 사용자의 좋아요 상태를 추적하기 위한 상태 추가
  const [postLiked, setPostLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  
  // 게시글 정보 가져오기
  const post = getPostById(id as string) || {
    id: id as string,
    title: '게시글을 찾을 수 없습니다',
    content: '',
    date: '',
    likes: 0,
    comments: 0,
  };
  
  // 댓글 목록 가져오기
  const comments = getCommentsByPostId(id as string);

  // 좋아요 처리 함수 - 토글 방식으로 변경
  const handleLike = () => {
    // 좋아요 상태 토글
    const newLikedState = !postLiked;
    setPostLiked(newLikedState);
    
    // Context를 통해 좋아요 수 업데이트
    togglePostLike(id as string, newLikedState);
  };

  // 댓글 좋아요 처리 함수 - 토글 방식으로 변경
  const handleCommentLike = (commentId: string) => {
    // 현재 댓글의 좋아요 상태
    const currentLiked = commentLikes[commentId] || false;
    
    // 좋아요 상태 토글
    const newLikedState = !currentLiked;
    
    // 상태 업데이트
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: newLikedState
    }));
    
    // Context를 통해 댓글 좋아요 수 업데이트
    toggleCommentLike(commentId, newLikedState);
  };

  // 날짜 포매팅 함수
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '날짜 없음';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (error) {
      return '날짜 형식 오류';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <CommunityHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 뒤로가기 버튼 */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>자유 글 목록</Text>
        </View>
        
        {/* 게시글 내용 */}
        <View style={styles.card}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.date}>{post.date ? formatDate(post.date) : '날짜 없음'}</Text>
          <View style={styles.divider} />
          <Text style={styles.content}>{post.content}</Text>
          
          {/* 좋아요 & 댓글 카운트 - 좋아요 색상 조건부 변경 */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconRow} onPress={handleLike}>
              <AntDesign 
                name={postLiked ? "heart" : "hearto"} // 활성화 시 채워진 하트, 비활성화 시 빈 하트
                size={18} 
                color="#e53935" // 항상 빨간색
              />
              <Text style={styles.count}>
                {post.likes}
              </Text>
            </TouchableOpacity>
            <View style={styles.iconRow}>
              <AntDesign name="message1" size={18} color="#3f51b5" />
              <Text style={styles.count}>{post.comments}</Text>
            </View>
          </View>
        </View>
        
        {/* 게시글 수정 버튼 - 게시글 본문 아래로 이동 */}
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/community/free/edit',
            params: { id: post.id }
          })}
          style={styles.editPostButton}
        >
          <Text style={styles.editPostButtonText}>게시글 수정</Text>
        </TouchableOpacity>

        {/* 댓글 섹션 헤더 */}
        <View style={styles.commentHeader}>
          <Text style={styles.commentsTitle}>댓글 {comments.length}개</Text>
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: '/community/free/comment',
              params: { postId: post.id }
            })}
            style={styles.addCommentLink}
          >
            <Text style={styles.addCommentText}>댓글 작성</Text>
          </TouchableOpacity>
        </View>

        {/* 댓글 목록 - 박스 없이 */}
        {comments.length === 0 ? (
          <View style={styles.emptyComments}>
            <Text style={styles.emptyCommentsText}>아직 댓글이 없습니다.</Text>
            <Text style={styles.emptyCommentsSubText}>첫 댓글을 작성해보세요!</Text>
          </View>
        ) : (
          comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentAuthorRow}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentDate}>
                  {formatDate(comment.createdAt)}
                </Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity 
                  style={styles.commentIconRow}
                  onPress={() => handleCommentLike(comment.id)}
                >
                  <AntDesign 
                    name={commentLikes[comment.id] ? "heart" : "hearto"} // 활성화 시 채워진 하트, 비활성화 시 빈 하트
                    size={14} 
                    color="#e53935" // 항상 빨간색
                  />
                  <Text style={styles.commentCount}>{comment.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: '/community/free/comment/[commentId]',
                    params: { commentId: comment.id, postId: post.id }
                  })}
                >
                  <Text style={styles.editCommentText}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  count: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#e53935',
  },
  editPostButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f7ff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d0e3ff',
  },
  editPostButtonText: {
    color: '#1976d2',
    fontWeight: '500',
    fontSize: 13,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addCommentLink: {
    padding: 4,
  },
  addCommentText: {
    fontSize: 14,
    color: '#1976d2',
  },
  commentItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentAuthorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  commentLikeCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#e53935',
  },
  editCommentText: {
    fontSize: 13,
    color: '#888',
  },
  emptyComments: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  emptyCommentsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
  },
  emptyCommentsSubText: {
    fontSize: 13,
    color: '#aaa',
  },
});