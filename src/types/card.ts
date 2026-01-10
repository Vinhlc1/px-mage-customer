import { StaticImageData } from "next/image";

export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Card {
  id: string;
  name: string;
  mythology: string;
  image: string | StaticImageData;
  rarity: CardRarity;
  price: number;
  story: {
    preview: string;
    full: string;
  };
  nfcEnabled: boolean;
  stock?: number;
  seriesId?: string; // ID của series câu chuyện
  seriesOrder?: number; // Thứ tự trong series
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
