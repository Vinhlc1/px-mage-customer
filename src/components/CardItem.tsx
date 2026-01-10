import { Card } from "@/types/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Waves, Lock } from "lucide-react";
import Image from "next/image";

interface CardItemProps {
  card: Card;
  onClick: () => void;
  onNFCScan?: () => void;
  hasPurchased?: boolean;
}

const rarityColors = {
  Common: "bg-gray-500",
  Rare: "bg-blue-500",
  Epic: "bg-purple-500",
  Legendary: "bg-primary"
};

const CardItem = ({ card, onClick, onNFCScan, hasPurchased = false }: CardItemProps) => {
  return (
    <div className="group relative rounded-xl overflow-hidden card-glow bg-card border border-border transition-transform hover:scale-105">
      <div 
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="relative aspect-2/3 overflow-hidden">
        <Image
          src={card.image}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />
        <Badge className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-xs sm:text-sm ${rarityColors[card.rarity]}`}>
          {card.rarity}
        </Badge>
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-center">
            <span className="text-primary font-semibold text-sm sm:text-base">Read Story</span>
          </div>
        </div>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground line-clamp-1">
          {card.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{card.mythology}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold text-primary">${card.price}</span>
          {card.stock && card.stock < 10 && (
            <span className="text-xs text-destructive">Only {card.stock} left!</span>
          )}
        </div>
        
        {card.nfcEnabled && onNFCScan && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onNFCScan();
            }}
            className={hasPurchased 
              ? "w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 text-xs sm:text-sm" 
              : "w-full bg-muted/50 text-muted-foreground border border-border cursor-not-allowed text-xs sm:text-sm"
            }
            size="sm"
            disabled={!hasPurchased}
          >
            {hasPurchased ? (
              <>
                <Waves className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Quét thẻ NFC</span>
                <span className="sm:hidden">Quét NFC</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Cần mua thẻ để quét</span>
                <span className="sm:hidden">Cần mua</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardItem;
