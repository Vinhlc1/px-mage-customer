'use client';

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { RarityFilter } from "@/components/RarityFilter";
import { CardGrid } from "@/components/CardGrid";
import { CardModals } from "@/components/CardModals";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/contexts/CollectionContext";
import { useCardTemplates } from "@/hooks/use-card-templates";
import { useCardInteractions } from "@/hooks/use-card-interactions";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { hasPurchased } = useCollection();
  const { cards, isLoading } = useCardTemplates();
  const {
    selectedCard,
    isStoryModalOpen,
    isNFCScanModalOpen,
    handleCardClick,
    handleNFCScan,
    handleScanComplete,
    handleLoginRequired,
    closeStoryModal,
    closeNFCScanModal,
  } = useCardInteractions();

  const [filterRarity, setFilterRarity] = useState("All");

  const filteredCards = useMemo(
    () => (filterRarity === "All" ? cards : cards.filter((c) => c.rarity === filterRarity)),
    [cards, filterRarity]
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
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-secondary text-sm sm:text-base md:text-lg mb-3 sm:mb-4 animate-float">
            Bộ sưu tập thẻ NFC huyền thoại
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 sm:mb-6 text-shadow-glow leading-tight">
            Khám phá hành trình<br />của riêng bạn
          </h1>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 btn-glow"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Khám phá ngay
          </Button>
        </div>
      </section>

      {/* Card Gallery */}
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">Bộ sưu tập thẻ</h2>
          <RarityFilter value={filterRarity} onChange={setFilterRarity} />
        </div>

        <CardGrid
          cards={filteredCards}
          isLoading={isLoading}
          onCardClick={handleCardClick}
          onNFCScan={handleNFCScan}
          hasPurchased={hasPurchased}
        />
      </section>

      <CardModals
        selectedCard={selectedCard}
        isStoryOpen={isStoryModalOpen}
        isNFCOpen={isNFCScanModalOpen}
        isAuthenticated={isAuthenticated}
        onCloseStory={closeStoryModal}
        onCloseNFC={closeNFCScanModal}
        onLoginRequired={handleLoginRequired}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
}
