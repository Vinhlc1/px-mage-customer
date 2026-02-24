import CardItem from "@/components/CardItem";
import { Card } from "@/types/card";

interface CardGridProps {
  cards: Card[];
  isLoading: boolean;
  onCardClick: (card: Card) => void;
  onNFCScan: (card: Card) => void;
  hasPurchased: (id: string) => boolean;
}

export function CardGrid({
  cards,
  isLoading,
  onCardClick,
  onNFCScan,
  hasPurchased,
}: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {isLoading ? (
        <div className="col-span-full text-center py-16 text-muted-foreground">
          Đang tải thẻ…
        </div>
      ) : cards.length === 0 ? (
        <div className="col-span-full text-center py-16 text-muted-foreground">
          Không tìm thấy thẻ nào.
        </div>
      ) : (
        cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
            onNFCScan={() => onNFCScan(card)}
            hasPurchased={hasPurchased(card.id)}
          />
        ))
      )}
    </div>
  );
}
