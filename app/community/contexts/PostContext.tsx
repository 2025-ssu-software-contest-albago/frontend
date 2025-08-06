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

// 실제 사람들이 작성할 만한 예시 게시글 데이터
const initialPosts: Post[] = [
  {
    id: '1',
    title: '오늘 알바 첫 출근했어요!',
    content: '처음이라 많이 긴장했는데, 사장님도 친절하시고 동료분들도 잘 챙겨주셔서 생각보다 괜찮았어요. 혹시 알바 초보가 꼭 알아야 할 팁 있으면 공유 부탁드려요!',
    likes: 8,
    comments: 2,
    date: '2025-08-01'
  },
  {
    id: '2',
    title: '시급 인상 요청, 어떻게 말해야 할까요?',
    content: '일한 지 6개월 정도 됐는데, 시급이 너무 낮아서 고민입니다. 사장님께 인상 요청하려면 어떤 식으로 말하는 게 좋을까요? 경험 있으신 분들 조언 부탁드려요.',
    likes: 12,
    comments: 3,
    date: '2025-08-02'
  },
  {
    id: '3',
    title: '알바하면서 힘들었던 점 공유해요',
    content: '저는 손님 응대가 제일 힘들었어요. 특히 바쁜 시간대에는 실수도 많고 스트레스도 많이 받네요. 다들 어떤 점이 제일 힘드셨나요?',
    likes: 3,
    comments: 1,
    date: '2025-08-03'
  },
  {
    id: '4',
    title: '알바 구할 때 꿀팁!',
    content: '구인 사이트에서 지원할 때 자기소개를 조금 더 구체적으로 쓰면 연락이 더 잘 오는 것 같아요. 여러분만의 알바 구하기 팁 있으면 알려주세요!',
    likes: 15,
    comments: 5,
    date: '2025-08-04'
  },
  {
    id: '5',
    title: '알바하면서 좋은 점도 많아요',
    content: '새로운 사람들을 많이 만나고, 사회 경험도 쌓을 수 있어서 좋아요. 힘든 점도 있지만 얻는 것도 많다고 생각해요. 다들 어떤 점이 가장 좋으셨나요?',
    likes: 11,
    comments: 3,
    date: '2025-08-05'
  },
];

// 초기 댓글 데이터
const initialComments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    content: '저도 첫날 엄청 떨렸어요! 그래도 금방 적응하실 거예요. 화이팅!',
    author: '알바선배',
    createdAt: '2025-08-01T10:12:00',
    likes: 2,
  },
  {
    id: 'c2',
    postId: '1',
    content: '알바 초보라면 실수해도 너무 걱정하지 마세요. 다들 처음엔 그래요!',
    author: '응원맨',
    createdAt: '2025-08-01T11:05:00',
    likes: 1,
  },
  {
    id: 'c3',
    postId: '2',
    content: '저는 솔직하게 말씀드렸어요. 일 열심히 하고 있다는 점 강조하면 좋아요!',
    author: '경험자',
    createdAt: '2025-08-02T09:30:00',
    likes: 3,
  },
  {
    id: 'c4',
    postId: '2',
    content: '타이밍도 중요해요. 바쁠 때 말고 여유 있을 때 조심스럽게!',
    author: '알바고수',
    createdAt: '2025-08-02T10:10:00',
    likes: 2,
  },
  {
    id: 'c5',
    postId: '2',
    content: '저는 문자로 요청했더니 더 편하게 얘기할 수 있었어요.',
    author: '익명',
    createdAt: '2025-08-02T12:20:00',
    likes: 1,
  },
  {
    id: 'c6',
    postId: '3',
    content: '저도 손님 응대가 제일 힘들었어요. 특히 컴플레인 받을 때...',
    author: '공감해요',
    createdAt: '2025-08-03T14:00:00',
    likes: 0,
  },
  {
    id: 'c7',
    postId: '4',
    content: '자기소개에 성실함 강조하면 연락 많이 오더라고요!',
    author: '꿀팁공유',
    createdAt: '2025-08-04T08:45:00',
    likes: 2,
  },
  {
    id: 'c8',
    postId: '4',
    content: '경력 있으면 꼭 적으세요. 사장님들이 좋아하십니다.',
    author: '경력자',
    createdAt: '2025-08-04T09:10:00',
    likes: 1,
  },
  {
    id: 'c12',
    postId: '4',
    content: '지원할 때 연락처를 정확히 적는 것도 중요해요!',
    author: '연락왕',
    createdAt: '2025-08-04T09:30:00',
    likes: 1,
  },
  {
    id: 'c13',
    postId: '4',
    content: '면접 볼 때 밝게 인사하면 인상 좋아져요!',
    author: '면접달인',
    createdAt: '2025-08-04T10:00:00',
    likes: 0,
  },
  {
    id: 'c14',
    postId: '4',
    content: '알바 후기 찾아보고 지원하면 실패 확률 줄어요!',
    author: '정보수집러',
    createdAt: '2025-08-04T10:30:00',
    likes: 1,
  },
  {
    id: 'c9',
    postId: '5',
    content: '저는 다양한 사람 만나는 게 제일 좋았어요!',
    author: '사교왕',
    createdAt: '2025-08-05T15:30:00',
    likes: 1,
  },
  {
    id: 'c10',
    postId: '5',
    content: '사회 경험 쌓으면서 자신감도 많이 생겼어요.',
    author: '자신감UP',
    createdAt: '2025-08-05T16:00:00',
    likes: 2,
  },
  {
    id: 'c11',
    postId: '5',
    content: '알바하면서 친구도 많이 사귀었어요!',
    author: '친구많은알바생',
    createdAt: '2025-08-05T17:10:00',
    likes: 0,
  },
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

