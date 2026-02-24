"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/types/card";
import { useCollection } from "@/contexts/CollectionContext";
import { toast } from "@/hooks/use-toast";

interface UseCardInteractionsResult {
  selectedCard: Card | null;
  isStoryModalOpen: boolean;
  isNFCScanModalOpen: boolean;
  handleCardClick: (card: Card) => void;
  handleNFCScan: (card: Card) => void;
  handleScanComplete: () => void;
  handleLoginRequired: () => void;
  closeStoryModal: () => void;
  closeNFCScanModal: () => void;
}

/**
 * Manages card click, NFC scan, story modal, and login-redirect interactions.
 * Shared between Home page and Marketplace page.
 */
export function useCardInteractions(): UseCardInteractionsResult {
  const router = useRouter();
  const { hasPurchased } = useCollection();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isNFCScanModalOpen, setIsNFCScanModalOpen] = useState(false);

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
    router.push("/login");
  };

  return {
    selectedCard,
    isStoryModalOpen,
    isNFCScanModalOpen,
    handleCardClick,
    handleNFCScan,
    handleScanComplete,
    handleLoginRequired,
    closeStoryModal: () => setIsStoryModalOpen(false),
    closeNFCScanModal: () => setIsNFCScanModalOpen(false),
  };
}
