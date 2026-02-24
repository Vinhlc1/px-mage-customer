"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { RarityFilter } from "@/components/RarityFilter";
import { CardGrid } from "@/components/CardGrid";
import { CardModals } from "@/components/CardModals";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/contexts/CollectionContext";
import { useCardTemplates } from "@/hooks/use-card-templates";
import { useCardInteractions } from "@/hooks/use-card-interactions";

const Marketplace = () => {
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

      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-4">
            Cửa hàng thẻ bài
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Khám phá và sưu tập thẻ NFC huyền thoại
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Thẻ đang bán</h2>
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
};

export default Marketplace;
