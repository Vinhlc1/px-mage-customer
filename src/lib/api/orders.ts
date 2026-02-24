import { apiGet, apiPost } from "../api-client";

export interface BeOrderItem {
  orderItemId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BeOrder {
  orderId: number;
  orderDate: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  shippingAddress: string | null;
  paymentMethod: string | null;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: BeOrderItem[];
}

export interface CreateOrderItemRequest {
  cardId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customText?: string;
}

export interface CreateOrderRequest {
  customerId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  orderItems: CreateOrderItemRequest[];
}

export async function createOrder(req: CreateOrderRequest): Promise<BeOrder> {
  return apiPost<BeOrder>("/api/orders", req);
}

export async function getOrdersByCustomer(
  customerId: number
): Promise<BeOrder[]> {
  return apiGet<BeOrder[]>(`/api/orders/customer/${customerId}`);
}

export async function getOrderById(id: number): Promise<BeOrder> {
  return apiGet<BeOrder>(`/api/orders/${id}`);
}
