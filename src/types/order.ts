import { CartItem } from "./card";

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "completed" | "pending" | "shipped" | "delivered";
  paymentMethod: string;
  shippingInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}
