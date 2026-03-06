import type { Card } from "@/types/card";
import { apiGet } from "../api-client";

export interface BeCardTemplate {
  cardTemplateId: number;
  templateName: string;
  arcanaType: string;
  cardNumber: number | null;
  description: string | null;
  imageUrl: string | null;
  rarity: string;
  basePrice: number;
  isActive: boolean;
  framework?: unknown;
  divineHelper?: unknown;
  cardContents?: unknown[];
  setStory?: unknown;
}

export interface BePhysicalCard {
  cardId: number;
  nfcUuid: string;
  customText: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getCardTemplates(): Promise<BeCardTemplate[]> {
  const result = await apiGet<any>("/api/cards/templates");
  // Pageable response from BE: { content: [...] }
  return result?.content || result || [];
}

export async function getCardTemplate(id: number): Promise<BeCardTemplate> {
  return apiGet<BeCardTemplate>(`/api/cards/templates/${id}`);
}

export async function getCards(): Promise<BePhysicalCard[]> {
  const result = await apiGet<any>("/api/cards");
  return result?.content || result || [];
}

export async function getCardById(id: number): Promise<BePhysicalCard> {
  return apiGet<BePhysicalCard>(`/api/cards/${id}`);
}

export function mapCardTemplate(tpl: BeCardTemplate): Card {
  return {
    id: String(tpl.cardTemplateId),
    templateId: tpl.cardTemplateId,
    name: tpl.templateName || "Unknown Card",
    mythology: tpl.description ?? "PixelMage Collection",
    image: tpl.imageUrl ?? "/placeholder-card.png",
    rarity: (tpl.rarity as any) || "Common",
    price: tpl.basePrice || 0,
    nfcEnabled: true,
    story: tpl.description
      ? { preview: tpl.description, full: tpl.description }
      : undefined,
  };
}

export async function fetchCardTemplates(): Promise<Card[]> {
  const templates = await getCardTemplates();
  return templates.map((tpl) => mapCardTemplate(tpl));
}
