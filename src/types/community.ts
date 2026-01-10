export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  cardId: string;
  cardName: string;
  cardImage: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  images?: string[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  cardId: string;
  tags: string[];
  images?: string[];
}
