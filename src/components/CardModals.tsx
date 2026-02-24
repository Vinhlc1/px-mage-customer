import StoryModal from "@/components/StoryModal";
import NFCScanModal from "@/components/NFCScanModal";
import { Card } from "@/types/card";

interface CardModalsProps {
  selectedCard: Card | null;
  isStoryOpen: boolean;
  isNFCOpen: boolean;
  isAuthenticated: boolean;
  onCloseStory: () => void;
  onCloseNFC: () => void;
  onLoginRequired: () => void;
  onScanComplete: () => void;
}

/**
 * Renders StoryModal + NFCScanModal together.
 * Used wherever a card listing needs both modals.
 */
export function CardModals({
  selectedCard,
  isStoryOpen,
  isNFCOpen,
  isAuthenticated,
  onCloseStory,
  onCloseNFC,
  onLoginRequired,
  onScanComplete,
}: CardModalsProps) {
  return (
    <>
      <StoryModal
        card={selectedCard}
        isOpen={isStoryOpen}
        onClose={onCloseStory}
        onLoginRequired={onLoginRequired}
        isAuthenticated={isAuthenticated}
      />
      <NFCScanModal
        card={selectedCard}
        isOpen={isNFCOpen}
        onClose={onCloseNFC}
        onScanComplete={onScanComplete}
      />
    </>
  );
}
