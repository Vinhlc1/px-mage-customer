"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, Package, History, Settings, MessageCircle } from "lucide-react";
import { cards } from "@/data/cards";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/contexts/CollectionContext";
import { usePurchaseHistory } from "@/contexts/PurchaseHistoryContext";
import { useCommunity } from "@/contexts/CommunityContext";
import PageLayout from "@/components/layout/PageLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import InventoryTab from "@/components/profile/InventoryTab";
import PostsTab from "@/components/profile/PostsTab";
import PurchaseHistoryTab from "@/components/profile/PurchaseHistoryTab";
import SettingsTab from "@/components/profile/SettingsTab";

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams?.get("tab") || "profile";
  
  const { user, logout } = useAuth();
  const { collection } = useCollection();
  const { orders } = usePurchaseHistory();
  const { getUserPosts } = useCommunity();
  
  const [username, setUsername] = useState(user?.username || "MysticSeeker");
  const [email, setEmail] = useState(user?.email || "user@example.com");
  
  // Get user cards from collection context
  const userCards = cards.filter(card => collection.purchasedCards.includes(card.id));
  
  // Get user's posts
  const userPosts = getUserPosts(user?.username || "MysticSeeker");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile save logic
  };

  return (
    <PageLayout>
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue={defaultTab} className="space-y-6 sm:space-y-8">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <TabsTrigger value="profile" className="flex-col sm:flex-row gap-1 sm:gap-2">
                <User className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex-col sm:flex-row gap-1 sm:gap-2">
                <Package className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex-col sm:flex-row gap-1 sm:gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs sm:text-sm hidden md:inline">My Posts</span>
                <span className="text-xs sm:text-sm md:hidden">Posts</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-col sm:flex-row gap-1 sm:gap-2 hidden sm:flex">
                <History className="w-4 h-4" />
                <span className="text-xs sm:text-sm">History</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-col sm:flex-row gap-1 sm:gap-2 hidden sm:flex">
                <Settings className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <ProfileHeader
                username={username}
                email={email}
                cardsCount={userCards.length}
                collectedCount={collection.collectedCards.length}
                completedSeriesCount={collection.completedSeries.length}
                onUsernameChange={setUsername}
                onEmailChange={setEmail}
                onSave={handleSaveProfile}
              />
            </TabsContent>

            <TabsContent value="inventory" className="space-y-8">
              <InventoryTab userCards={userCards} />
            </TabsContent>

            <TabsContent value="posts" className="space-y-8">
              <PostsTab 
                userPosts={userPosts} 
                onViewPost={() => router.push("/community")}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-8">
              <PurchaseHistoryTab orders={orders} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <SettingsTab onLogout={handleLogout} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default Profile;
