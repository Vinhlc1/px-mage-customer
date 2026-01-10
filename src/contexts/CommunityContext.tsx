import { createContext, useContext, useState, ReactNode } from "react";
import { CommunityPost, CreatePostData, Comment } from "@/types/community";
import { cards } from "@/data/cards";

interface CommunityContextType {
  posts: CommunityPost[];
  likedPosts: string[];
  addPost: (postData: CreatePostData, userInfo?: { id: string; username: string }) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string, userInfo?: { id: string; username: string }) => void;
  likeComment: (postId: string, commentId: string) => void;
  getPostsByCard: (cardId: string) => CommunityPost[];
  getUserPosts: (authorName: string) => CommunityPost[];
  isPostLiked: (postId: string) => boolean;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  // Mock initial posts
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "post_1",
      title: "My Epic Loki's Mischief Collection Story!",
      content: "Just got this amazing Loki card! The artwork is incredible and the NFC feature works perfectly. The trickster energy is real! 🔥",
      cardId: "loki-mischief",
      cardName: "Loki's Mischief",
      cardImage: "/placeholder.svg",
      authorId: "user_1",
      authorName: "NorseMaster",
      authorAvatar: "",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      likes: 12,
      comments: [
        {
          id: "comment_1",
          content: "Wow! That's such a rare card. I'm so jealous! 😍",
          authorId: "user_2",
          authorName: "CardCollector",
          authorAvatar: "",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          likes: 3
        }
      ],
      tags: ["Legendary", "Norse", "Loki"],
      images: ["/placeholder.svg"]
    },
    {
      id: "post_2", 
      title: "Odin's Wisdom - The Crown Jewel of My Collection",
      content: "After months of searching, I finally got Odin's Wisdom! The detail on this card is absolutely stunning. The way it captures the All-Father's majesty is breathtaking.",
      cardId: "odin-wisdom",
      cardName: "Odin's Wisdom",
      cardImage: "/placeholder.svg",
      authorId: "user_3",
      authorName: "ValhallaBound",
      authorAvatar: "",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      likes: 18,
      comments: [],
      tags: ["Legendary", "Norse", "Odin"],
      images: []
    }
  ]);  const addPost = (postData: CreatePostData, userInfo?: { id: string; username: string }) => {
    const card = cards.find(c => c.id === postData.cardId);
    if (!card) return;

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      title: postData.title,
      content: postData.content,
      cardId: postData.cardId,
      cardName: card.name,
      cardImage: card.image,
      authorId: userInfo?.id || "current_user",
      authorName: userInfo?.username || "MysticSeeker",
      authorAvatar: "",
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      tags: postData.tags,
      images: postData.images || []
    };

    setPosts(prev => [newPost, ...prev]);
  };
  const likePost = (postId: string) => {
    const isLiked = likedPosts.includes(postId);
    
    if (isLiked) {
      // Unlike the post
      setLikedPosts(prev => prev.filter(id => id !== postId));
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, post.likes - 1) }
          : post
      ));
    } else {
      // Like the post
      setLikedPosts(prev => [...prev, postId]);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    }
  };  const addComment = (postId: string, content: string, userInfo?: { id: string; username: string }) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      content,
      authorId: userInfo?.id || "current_user",
      authorName: userInfo?.username || "You",
      authorAvatar: "",
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const likeComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
            )
          }
        : post
    ));
  };  const getPostsByCard = (cardId: string) => {
    return posts.filter(post => post.cardId === cardId);
  };

  const getUserPosts = (authorName: string) => {
    return posts.filter(post => post.authorName === authorName);
  };

  const isPostLiked = (postId: string) => {
    return likedPosts.includes(postId);
  };
  return (
    <CommunityContext.Provider value={{
      posts,
      likedPosts,
      addPost,
      likePost,
      addComment,
      likeComment,
      getPostsByCard,
      getUserPosts,
      isPostLiked
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within CommunityProvider");
  }
  return context;
};
