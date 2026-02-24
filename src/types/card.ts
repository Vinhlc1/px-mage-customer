import { StaticImageData } from "next/image";

export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Card {
  id: string;                      // BE: cardTemplateId.toString() or physical cardId.toString()
  templateId?: number;             // BE: cardTemplateId (for marketplace)
  cardId?: number;                 // BE: physical card cardId (for owned cards)
  nfcUuid?: string;                // BE: physical card nfcUuid
  name: string;                    // BE: template.name
  mythology: string;               // BE: template.description or 'PixelMage Collection'
  image: string | StaticImageData; // BE: template.designPath or placeholder
  rarity: CardRarity;              // Default 'Common' if not from BE
  price: number;                   // BE: price tier pricePerUnit
  story?: {                        // Optional; BE description as fallback
    preview: string;
    full: string;
  };
  nfcEnabled: boolean;             // Always true for BE cards
  stock?: number;                  // BE: count of physical cards in template.cards
  seriesId?: string;               // Legacy (not from BE)
  seriesOrder?: number;            // Legacy (not from BE)
}

export interface CartItem {
  card: Card;
  quantity: number;
}

export interface CardPack {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  cardCount: number;
  bonusCards: number;
  image: string;
  rarityOdds: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  badge?: string;
  guaranteedLegendary?: boolean;
}

export interface StorySeries {
  id: string;
  name: string;
  description: string;
  mythology: string;
  totalCards: number;
  cards: string[]; // Array of card IDs
  completedStory: string; // Câu chuyện hoàn chỉnh khi collect đủ
  rewards?: {
    title: string;
    description: string;
    badge?: string;
  };
}

export interface UserCollection {
  collectedCards: string[]; // Array of card IDs user đã sưu tầm
  completedSeries: string[]; // Array of series IDs đã hoàn thành
  purchasedCards: string[]; // Array of card IDs user đã mua
}
