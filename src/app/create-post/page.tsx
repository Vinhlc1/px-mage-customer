"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Image as ImageIcon, Tag, FileText, Sparkles } from "lucide-react";
import { useCommunity } from "@/contexts/CommunityContext";
import { useCollection } from "@/contexts/CollectionContext";
import { useAuth } from "@/contexts/AuthContext";
import { cards } from "@/data/cards";
import { useToast } from "@/hooks/use-toast";

const CreatePost = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { addPost } = useCommunity();
  const { collection } = useCollection();
  const { isAuthenticated, login, user } = useAuth();
  
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    cardId: "",
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user's collected cards for post creation
  const userCards = cards.filter(card => collection.purchasedCards.includes(card.id));
  const selectedCard = userCards.find(card => card.id === newPost.cardId);

  // Debug: log authentication status
  console.log("isAuthenticated:", isAuthenticated);
  console.log("userCards:", userCards);
  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-12 bg-card rounded-lg border">
              <h1 className="text-4xl font-serif font-bold mb-4">Login Required</h1>
              <p className="text-muted-foreground mb-8">
                You need to be logged in to share your story with the community
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => router.push("/community")}
                >
                  Go to Community
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push("/marketplace")}
                >
                  Browse Cards
                </Button>
              </div>
                {/* Temporary login for testing */}
              <div className="mt-8 p-4 bg-secondary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">Quick login for testing:</p>
                <Button 
                  onClick={() => login("test@example.com", "password")}
                  variant="outline"
                  size="sm"
                >
                  Quick Login
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost({
        ...newPost, 
        tags: [...newPost.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost({
      ...newPost,
      tags: newPost.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.cardId) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, content, and select a card",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);    try {
      addPost(newPost, { id: user?.id || "current_user", username: user?.username || "MysticSeeker" });
      
      toast({
        title: "Post Created Successfully! 🎉",
        description: "Your story has been shared with the community"
      });

      // Navigate back to community or profile
      router.push("/community");
    } catch (error) {
      toast({
        title: "Error Creating Post",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      
      {/* Debug info */}
      <div className="fixed top-4 right-4 bg-red-600 text-white p-2 rounded text-xs z-50">
        Auth: {isAuthenticated.toString()} | Cards: {userCards.length}
      </div>
      
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push("/community")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">Share Your Story</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                Tell the community about your amazing card collection experience
              </p>
            </div>
          </div><div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Post Details
                  </CardTitle>
                  <CardDescription>
                    Share your experience and thoughts about your card collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Post Title *</label>
                    <Input
                      placeholder="Give your post an exciting title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="text-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Story *</label>
                    <Textarea
                      placeholder="Share your collection story, how you got this card, what makes it special, any interesting experiences..."
                      className="min-h-50 resize-none"
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      {newPost.content.length}/1000 characters
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags (Optional)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tags (e.g., legendary, norse, rare)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {newPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newPost.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>            {/* Sidebar */}
            <div className="space-y-6">
              {/* Card Selection */}
              <Card className="bg-card border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Select Your Card
                  </CardTitle>
                  <CardDescription>
                    Choose a card from your collection to feature
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {/* Card Preview */}
                  {selectedCard && (
                    <div className="border rounded-lg p-4 bg-secondary/5">
                      <div className="relative w-full h-32 mb-3">
                        <Image 
                          src={selectedCard.image} 
                          alt={selectedCard.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="font-semibold">{selectedCard.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedCard.mythology}</p>
                      <Badge className="mt-2">{selectedCard.rarity}</Badge>
                    </div>
                  )}

                  {userCards.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        You need to purchase cards first
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push("/marketplace")}
                      >
                        Browse Marketplace
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>              {/* Publishing Options */}
              <Card className="bg-card border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Publish
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleCreatePost}
                      disabled={isSubmitting || !newPost.title || !newPost.content || !newPost.cardId}
                    >
                      {isSubmitting ? "Publishing..." : "Share Your Story"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push("/community")}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Your story will be visible to all community members</p>
                    <p>• You can edit or delete your post later</p>
                    <p>• Be respectful and follow community guidelines</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreatePost;
