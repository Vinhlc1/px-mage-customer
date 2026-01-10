'use client';

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CardItem from "@/components/CardItem";
import StoryModal from "@/components/StoryModal";
import NFCScanModal from "@/components/NFCScanModal";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { cards } from "@/data/cards";
import { Card } from "@/types/card";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/contexts/CollectionContext";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { hasPurchased } = useCollection();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isNFCScanModalOpen, setIsNFCScanModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filterRarity, setFilterRarity] = useState<string>("All");

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsStoryModalOpen(true);
  };
  
  const handleNFCScan = (card: Card) => {
    if (!hasPurchased(card.id)) {
      toast({
        title: "Chưa mua thẻ",
        description: "Bạn cần mua thẻ này trước khi có thể quét NFC",
        variant: "destructive",
      });
      return;
    }
    setSelectedCard(card);
    setIsNFCScanModalOpen(true);
  };
  
  const handleScanComplete = () => {
    toast({
      title: "Thành công!",
      description: "Thẻ đã được thêm vào bộ sưu tập của bạn",
    });
  };
  
  const handleLoginRequired = () => {
    setIsAuthModalOpen(true);
  };

  const filteredCards = useMemo(() => 
    filterRarity === "All" 
      ? cards 
      : cards.filter(card => card.rarity === filterRarity),
    [filterRarity]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-150 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(/assets/hero-bg.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-secondary text-sm sm:text-base md:text-lg mb-3 sm:mb-4 animate-float">Ultimate Guide To Astrology</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 sm:mb-6 text-shadow-glow leading-tight">
            Your Star Determines<br />Your Life's Journey
          </h1>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 btn-glow"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explore Cards
          </Button>
        </div>
      </section>

      {/* Card Gallery */}
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">Card Collection</h2>
          
          <div className="flex flex-wrap gap-2">
            {['All', 'Common', 'Rare', 'Epic', 'Legendary'].map((rarity) => (
              <Button
                key={rarity}
                variant={filterRarity === rarity ? "default" : "outline"}
                onClick={() => setFilterRarity(rarity)}
                className={filterRarity === rarity ? "bg-primary" : ""}
                size="sm"
              >
                <span className="text-xs sm:text-sm">{rarity}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
              onNFCScan={() => handleNFCScan(card)}
              hasPurchased={hasPurchased(card.id)}
            />
          ))}
        </div>
      </section>

      <StoryModal
        card={selectedCard}
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        onLoginRequired={handleLoginRequired}
        isAuthenticated={isAuthenticated}
      />
      
      <NFCScanModal
        card={selectedCard}
        isOpen={isNFCScanModalOpen}
        onClose={() => setIsNFCScanModalOpen(false)}
        onScanComplete={handleScanComplete}
      />
      
      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
