"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CardItem from "@/components/CardItem";
import StoryModal from "@/components/StoryModal";
import NFCScanModal from "@/components/NFCScanModal";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { cards } from "@/data/cards";
import { Card } from "@/types/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/contexts/CollectionContext";
import { toast } from "@/hooks/use-toast";

const Marketplace = () => {
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

  const filteredCards = filterRarity === "All" 
    ? cards 
    : cards.filter(card => card.rarity === filterRarity);

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-4">Card Marketplace</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Discover and collect mythological NFC cards
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Available Cards</h2>
          
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
};

export default Marketplace;
