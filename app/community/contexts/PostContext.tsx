import { AntDesign } from '@expo/vector-icons'; // AntDesign 아이콘 추가
import React, { createContext, ReactNode, useContext, useState } from 'react';

// 댓글 타입 정의
export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

// 게시글 타입 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: number; // 댓글 수
  date?: string;
}

// 초기 게시글 데이터
const initialPosts: Post[] = [
  { id: '1', title: '첫 번째 자유글', content: '자유롭게 의견을 나눠보세요!', likes: 8, comments: 2 },
  { id: '2', title: '두 번째 자유글', content: '커뮤니티에 오신 것을 환영합니다.', likes: 12, comments: 5 },
  { id: '3', title: '세 번째 자유글', content: '좋아요와 댓글을 남겨주세요.', likes: 3, comments: 0 },
  { id: '4', title: '네 번째 자유글', content: '인기 많은 글은 인기 게시판에도 노출됩니다!', likes: 15, comments: 8 },
  { id: '5', title: '다섯 번째 자유글', content: '10개 이상의 좋아요를 받으면 인기글이 됩니다.', likes: 11, comments: 3 },
];

// 초기 댓글 데이터
const initialComments: Comment[] = [
  { id: 'c1', postId: '1', content: '좋은 글입니다!', author: '사용자1', createdAt: '2025-07-18T10:30:00Z', likes: 2 },
  { id: 'c2', postId: '1', content: '유익한 정보 감사합니다.', author: '사용자2', createdAt: '2025-07-18T11:15:00Z', likes: 0 },
  { id: 'c3', postId: '2', content: '흥미로운 주제네요.', author: '사용자3', createdAt: '2025-07-17T09:45:00Z', likes: 1 },
  { id: 'c4', postId: '2', content: '자주 방문하겠습니다!', author: '사용자4', createdAt: '2025-07-17T10:10:00Z', likes: 0 },
];

// Context 인터페이스 정의
interface PostContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments'>) => void;
  likePost: (id: string) => void;
  getPostById: (id: string) => Post | undefined;
  getPopularPosts: (minLikes?: number) => Post[];
  
  // 댓글 관련 함수들
  getCommentsByPostId: (postId: string) => Comment[];
  addComment: (postId: string, content: string) => void;
  getCommentById: (commentId: string) => Comment | undefined;
  updateComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  likeComment: (commentId: string) => void;
  togglePostLike: (id: string, liked: boolean) => void;
  toggleCommentLike: (commentId: string, liked: boolean) => void;
}

// Context 생성
const PostContext = createContext<PostContextType | undefined>(undefined);

// Provider 컴포넌트
export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  
  // 새 게시글 추가
  const addPost = (post: Omit<Post, 'id' | 'likes' | 'comments'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(), // 간단한 ID 생성
      likes: 0,
      comments: 0,
    };
    
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };
  
  // 게시글 좋아요 증가
  const likePost = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };
  
  // ID로 게시글 찾기
  const getPostById = (id: string) => {
    return posts.find((post) => post.id === id);
  };
  
  // 인기 게시글 필터링 (10개 이상 좋아요)
  const getPopularPosts = (minLikes: number = 10) => {
    return posts
      .filter((post) => post.likes >= minLikes)
      .sort((a, b) => b.likes - a.likes);
  };

  // 특정 게시글의 댓글 가져오기
  const getCommentsByPostId = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
  };

  // 댓글 추가
  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`, // 간단한 댓글 ID 생성
      postId,
      content,
      author: '현재 사용자', // 실제로는 로그인 사용자 정보 사용
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    setComments(prev => [...prev, newComment]);
    
    // 게시글의 댓글 수 증가
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 } 
          : post
      )
    );
  };

  // ID로 댓글 찾기
  const getCommentById = (commentId: string) => {
    return comments.find(comment => comment.id === commentId);
  };

  // 댓글 수정
  const updateComment = (commentId: string, content: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId
          ? { ...comment, content }
          : comment
      )
    );
  };

  // 댓글 삭제
  const deleteComment = (commentId: string) => {
    const comment = getCommentById(commentId);
    if (!comment) return;
    
    // 댓글 삭제
    setComments(prev => prev.filter(c => c.id !== commentId));
    
    // 게시글의 댓글 수 감소
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === comment.postId 
          ? { ...post, comments: Math.max(0, post.comments - 1) } 
          : post
      )
    );
  };

  // 댓글 좋아요
  const likeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  // 게시글 좋아요 토글
  const togglePostLike = (id: string, liked: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          // 좋아요를 누르면 +1, 취소하면 -1
          const delta = liked ? 1 : -1;
          return { ...post, likes: Math.max(0, post.likes + delta) };
        }
        return post;
      })
    );
  };
  
  // 댓글 좋아요 토글
  const toggleCommentLike = (commentId: string, liked: boolean) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          // 좋아요를 누르면 +1, 취소하면 -1
          const delta = liked ? 1 : -1;
          return { ...comment, likes: Math.max(0, comment.likes + delta) };
        }
        return comment;
      })
    );
  };
  
  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        comments,
        setComments,
        addPost,
        likePost,
        getPostById,
        getPopularPosts,
        getCommentsByPostId,
        addComment,
        getCommentById,
        updateComment,
        deleteComment,
        likeComment,
        togglePostLike,
        toggleCommentLike,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

// 커스텀 훅으로 Context 사용 편리하게
export function usePostContext() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
}

