import { apiGet } from "../api-client";
import type { Card } from "@/types/card";

export interface BeCardTemplate {
  cardTemplateId: number;
  name: string;
  description: string | null;
  designPath: string | null;
  createdAt: string;
  updatedAt: string;
  cards?: BePhysicalCard[];
}

export interface BePhysicalCard {
  cardId: number;
  nfcUuid: string;
  customText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BeCardPriceTier {
  tierId: number;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
}

export async function getCardTemplates(): Promise<BeCardTemplate[]> {
  return apiGet<BeCardTemplate[]>("/api/card-templates");
}

export async function getCardTemplate(id: number): Promise<BeCardTemplate> {
  return apiGet<BeCardTemplate>(`/api/card-templates/${id}`);
}

export async function getCardPriceTiersByTemplate(
  templateId: number
): Promise<BeCardPriceTier[]> {
  return apiGet<BeCardPriceTier[]>(
    `/api/card-price-tiers/template/${templateId}`
  );
}

export async function getCards(): Promise<BePhysicalCard[]> {
  return apiGet<BePhysicalCard[]>("/api/cards");
}

export async function getCardById(id: number): Promise<BePhysicalCard> {
  return apiGet<BePhysicalCard>(`/api/cards/${id}`);
}

/** Map price tiers to the unit price for a given quantity (defaults to min tier) */
export function getPriceForQuantity(
  tiers: BeCardPriceTier[],
  quantity = 1
): number {
  if (!tiers.length) return 0;
  // Sort ascending by minQuantity
  const sorted = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);
  // Find the best tier for the quantity
  let best = sorted[0];
  for (const tier of sorted) {
    if (quantity >= tier.minQuantity) {
      best = tier;
    }
  }
  return Number(best.pricePerUnit);
}

/**
 * Convert a BE CardTemplate + resolved price into the FE Card type.
 * Single canonical mapper used by all pages.
 */
export function mapCardTemplate(tpl: BeCardTemplate, price: number): Card {
  return {
    id: String(tpl.cardTemplateId),
    templateId: tpl.cardTemplateId,
    name: tpl.name,
    mythology: tpl.description ?? "PixelMage Collection",
    image: tpl.designPath ?? "/placeholder-card.png",
    rarity: "Common",
    price,
    nfcEnabled: true,
    stock: tpl.cards?.length,
    story: tpl.description
      ? { preview: tpl.description, full: tpl.description }
      : undefined,
  };
}

/**
 * Fetch all card templates and resolve each one's base price in parallel.
 * Returns an array of FE Card objects ready for rendering.
 */
export async function fetchCardTemplatesWithPrices(): Promise<Card[]> {
  const templates = await getCardTemplates();
  return Promise.all(
    templates.map(async (tpl) => {
      try {
        const tiers = await getCardPriceTiersByTemplate(tpl.cardTemplateId);
        const price = tiers.length > 0 ? Number(tiers[0].pricePerUnit) : 0;
        return mapCardTemplate(tpl, price);
      } catch {
        return mapCardTemplate(tpl, 0);
      }
    })
  );
}
