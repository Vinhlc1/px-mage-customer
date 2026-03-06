import { apiGet, apiPost } from "../api-client";

export interface BeOrderItem {
  orderItemId: number;
  productName: string;
  productType: "SINGLE_CARD" | "CARD_PACK" | "BUNDLE";
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface BePaymentInfo {
  payUrl?: string; // used for VNPay
}

export interface BeOrder {
  orderId: number;
  orderCode: string; // from BE? or use orderId
  paymentGateway: "COD" | "VNPAY";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  shippingAddress: string;
  shippingPhone: string;
  voucherCode: string | null;
  createdAt: string;
  orderItems: BeOrderItem[];
  payment?: BePaymentInfo;
}

export interface CreateOrderItemRequest {
  cardTemplateId: number;
  productName: string;
  productType: "SINGLE_CARD" | "CARD_PACK" | "BUNDLE";
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  paymentGateway: "COD" | "VNPAY";
  shippingAddress: string;
  shippingPhone: string;
  voucherCode?: string;
  items: CreateOrderItemRequest[];
}

export async function createOrder(req: CreateOrderRequest): Promise<BeOrder> {
  return apiPost<BeOrder>("/api/orders", req);
}

export async function getMyOrders(): Promise<BeOrder[]> {
  const result = await apiGet<any>("/api/orders/my");
  return result?.content || result || [];
}

export async function getOrderById(id: number): Promise<BeOrder> {
  return apiGet<BeOrder>(`/api/orders/${id}`);
}

export async function cancelOrder(id: number): Promise<void> {
  // Using apiPost or apiFetch for PATCH
  const { apiFetch } = await import("../api-client");
  await apiFetch(`/api/orders/${id}/cancel`, { method: "PATCH" });
}
