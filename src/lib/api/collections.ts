import { apiGet, apiPost, apiDelete, apiPut } from "../api-client";
import { BePhysicalCard } from "./cards";

export interface BeCardCollection {
  collectionId: number;
  collectionName: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BeCollectionItem {
  collectionItemId: number;
  card: BePhysicalCard;
  addedAt: string;
}

export async function getOwnedCards(
  customerId: number
): Promise<BePhysicalCard[]> {
  return apiGet<BePhysicalCard[]>(
    `/api/collections/owned-cards/${customerId}`
  );
}

export async function getCustomerCollections(
  customerId: number
): Promise<BeCardCollection[]> {
  return apiGet<BeCardCollection[]>(
    `/api/collections/customer/${customerId}`
  );
}

export async function getCollectionItems(
  collectionId: number
): Promise<BeCollectionItem[]> {
  return apiGet<BeCollectionItem[]>(`/api/collections/items/${collectionId}`);
}

export async function createCollection(
  customerId: number,
  data: { collectionName: string; description?: string; isPublic?: boolean }
): Promise<BeCardCollection> {
  return apiPost<BeCardCollection>(`/api/collections/${customerId}`, {
    collectionName: data.collectionName,
    description: data.description ?? null,
    isPublic: data.isPublic ?? false,
  });
}

export async function updateCollection(
  customerId: number,
  collectionId: number,
  data: { collectionName: string; description?: string; isPublic?: boolean }
): Promise<BeCardCollection> {
  return apiPut<BeCardCollection>(
    `/api/collections/${customerId}/${collectionId}`,
    {
      collectionName: data.collectionName,
      description: data.description ?? null,
      isPublic: data.isPublic ?? false,
    }
  );
}

export async function addCardToCollection(
  customerId: number,
  collectionId: number,
  cardId: number
): Promise<BeCollectionItem> {
  return apiPost<BeCollectionItem>(`/api/collections/items/${customerId}`, {
    collectionId,
    cardId,
  });
}

export async function removeCardFromCollection(
  customerId: number,
  collectionId: number,
  cardId: number
): Promise<void> {
  return apiDelete(
    `/api/collections/items/${customerId}/${collectionId}/${cardId}`
  );
}
