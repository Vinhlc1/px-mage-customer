import { apiGet } from "../api-client";

export interface BeInventoryItem {
  inventoryItemId: number;
  accountId: number;
  productName: string; // The snapshot name for display
  cardTemplateId: number; // For linking back to the template/image
  acquiredAt: string;
  source: "NFC_SCAN" | "ORDER_PAID";
}

export async function getMyInventory(): Promise<BeInventoryItem[]> {
  const result = await apiGet<any>("/api/inventory/my");
  return result?.content || result || [];
}

export async function getMyInventoryCount(): Promise<number> {
  const result = await apiGet<any>("/api/inventory/my/count");
  if (typeof result === "number") return result;
  return result?.data ?? result?.count ?? 0;
}

export async function getInventoryItemById(id: number): Promise<BeInventoryItem> {
  return apiGet<BeInventoryItem>(`/api/inventory/${id}`);
}
