"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import DevNotice from "@/components/DevNotice";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Filter,
  Search,
  Clock,
  User,
  Image as ImageIcon
} from "lucide-react";
import { useCommunity } from "@/contexts/CommunityContext";
import { useCollection } from "@/contexts/CollectionContext";
import { useAuth } from "@/contexts/AuthContext";
import { cards } from "@/data/cards";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { posts, addPost, likePost, addComment, isPostLiked } = useCommunity();
  const { collection } = useCollection();
  const { user } = useAuth();
  
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // Create post form state
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    cardId: "",
    tags: [] as string[],
  });

  // Get user's collected cards for post creation
  const userCards = cards.filter(card => collection.purchasedCards.includes(card.id));
  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.cardId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addPost(newPost, { id: user?.id || "current_user", username: user?.username || "MysticSeeker" });
    setNewPost({ title: "", content: "", cardId: "", tags: [] });
    setIsCreateModalOpen(false);
    
    toast({
      title: "Post Created! 🎉",
      description: "Your post has been shared with the community"
    });
  };
  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    
    addComment(postId, commentText, { id: user?.id || "current_user", username: user?.username || "You" });
    setCommentText("");
    
    toast({
      title: "Comment Added! 💬",
      description: "Your comment has been posted"
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return "Just now";
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.cardName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "All" || 
                         post.tags.includes(selectedFilter);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      <DevNotice feature="Community" description="chưa có API — đang dùng dữ liệu mẫu từ context." />
      
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-4">Community</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              Share your NFC card collection stories with fellow collectors
            </p>            {/* Create Post Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                onClick={() => router.push("/create-post")}
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Share Your Story</span>
                <span className="sm:hidden">Share Story</span>
              </Button>
              
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-primary w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Share
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">Share Your Card Story</DialogTitle>
                  <DialogDescription>
                    Tell the community about your amazing NFC card collection
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Post Title *</label>
                      <Input
                        placeholder="Give your post an exciting title..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Your Card *</label>
                      <Select 
                        value={newPost.cardId} 
                        onValueChange={(value) => setNewPost({...newPost, cardId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a card from your collection" />
                        </SelectTrigger>
                        <SelectContent>
                          {userCards.length === 0 ? (
                            <SelectItem value="" disabled>
                              No cards in your collection yet
                            </SelectItem>
                          ) : (
                            userCards.map((card) => (
                              <SelectItem key={card.id} value={card.id}>
                                <div className="flex items-center gap-2">
                                  <span>{card.name}</span>
                                  <Badge variant="secondary">{card.rarity}</Badge>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Story *</label>
                      <Textarea
                        placeholder="Share your collection story, how you got this card, what makes it special..."
                        className="min-h-30"
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tags (Optional)</label>
                      <Input
                        placeholder="legendary, norse, rare (comma separated)"
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                          setNewPost({...newPost, tags});
                        }}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsCreateModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={handleCreatePost}
                        disabled={userCards.length === 0}
                      >
                        Share Story
                      </Button>
                    </div>
                  </div>                </ScrollArea>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, cards, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full sm:w-35">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Posts</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                  <SelectItem value="Norse">Norse</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Epic">Epic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try adjusting your search" : "Be the first to share your story!"}
                  </p>
                  {!searchQuery && userCards.length > 0 && (
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="card-glass overflow-hidden">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm sm:text-base">{post.authorName}</h3>
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(post.createdAt)}
                          </div>
                        </div>
                        <CardTitle className="text-base sm:text-lg md:text-xl mb-2">{post.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <Badge variant="outline">
                            {post.cardName}
                          </Badge>
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="relative w-20 h-28 sm:w-24 sm:h-32 mx-auto sm:mx-0">
                        <Image 
                          src={post.cardImage} 
                          alt={post.cardName}
                          fill
                          className="object-cover rounded-lg border-2 border-primary/20"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                    </div>                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-2 ${
                          isPostLiked(post.id) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            isPostLiked(post.id) ? 'fill-current' : ''
                          }`} 
                        />
                        {post.likes}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {post.comments.length}
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    {/* Comments Section */}
                    {showComments === post.id && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        {/* Add Comment */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                          />
                          <Button 
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentText.trim()}
                          >
                            Post
                          </Button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 p-3 bg-secondary/10 rounded-lg">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{comment.authorName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                                <Button variant="ghost" size="sm" className="h-6 px-0 text-xs">
                                  <Heart className="w-3 h-3 mr-1" />
                                  {comment.likes}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
