import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Plus } from "lucide-react";
import { CommunityPost } from "@/types/community";

interface PostsTabProps {
  userPosts: CommunityPost[];
  onViewPost: () => void;
}

export default function PostsTab({ userPosts, onViewPost }: PostsTabProps) {
  return (
    <div className="card-glass p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold">My Stories</h2>
        <Link href="/create-post">
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Share New Story
          </Button>
        </Link>
      </div>
      
      {userPosts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">You haven't shared any stories yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Share your card collection experiences with the community!
          </p>
          <Link href="/create-post">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Share Your First Story
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {userPosts.map((post) => (
            <div key={post.id} className="card-glass p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="relative w-16 h-24 sm:w-20 sm:h-28 flex-shrink-0 mx-auto sm:mx-0">
                  <Image 
                    src={post.cardImage} 
                    alt={post.cardName}
                    fill
                    className="object-cover rounded-lg border-2 border-primary/20"
                  />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold">{post.title}</h3>
                    <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{post.cardName}</Badge>
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes} likes
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments.length} comments
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={onViewPost}
                    >
                      View in Community
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
