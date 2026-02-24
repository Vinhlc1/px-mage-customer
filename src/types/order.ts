import { CartItem } from "./card";

/** Legacy FE order type — kept for UI compatibility */
export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "completed" | "pending" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingInfo?: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

/** BE order shape from GET /api/orders/customer/{id} */
export interface BeOrderItem {
  orderItemId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customText: string | null;
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

