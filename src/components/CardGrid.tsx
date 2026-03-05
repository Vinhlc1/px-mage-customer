import CardItem from "@/components/CardItem";
import { Card } from "@/types/card";

interface CardGridProps {
  cards: Card[];
  isLoading: boolean;
  onCardClick: (card: Card) => void;
  onNFCScan: (card: Card) => void;
  hasPurchased: (id: string) => boolean;
}

function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card animate-pulse">
      <div className="aspect-2/3 bg-muted" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-6 bg-muted rounded w-1/3 mt-1" />
        <div className="h-8 bg-muted rounded w-full mt-2" />
      </div>
    </div>
  );
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
        Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
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
