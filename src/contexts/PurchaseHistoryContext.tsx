"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { getOrdersByCustomer, BeOrder } from "@/lib/api/orders";
import { useAuth } from "./AuthContext";

export interface PurchaseOrder {
  id: string;
  date: string;
  items: Array<{
    cardId: string;
    cardName: string;
    cardImage: string;
    quantity: number;
    price: number;
    rarity: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "completed" | "pending" | "cancelled";
  paymentMethod: string;
}

function mapBeOrder(order: BeOrder): PurchaseOrder {
  return {
    id: String(order.orderId),
    date: order.orderDate,
    items: (order.orderItems ?? []).map(item => ({
      cardId: String(item.orderItemId),
      cardName: `Card #${item.orderItemId}`,
      cardImage: "",
      quantity: item.quantity,
      price: Number(item.unitPrice),
      rarity: "Common",
    })),
    subtotal: Number(order.totalAmount),
    shipping: 0,
    tax: 0,
    total: Number(order.totalAmount),
    status: order.status === "COMPLETED" ? "completed"
      : order.status === "CANCELLED" ? "cancelled"
      : "pending",
    paymentMethod: order.paymentMethod ?? "Card",
  };
}

interface PurchaseHistoryContextType {
  orders: PurchaseOrder[];
  beOrders: BeOrder[];
  isLoading: boolean;
  addOrder: (order: PurchaseOrder) => void;
  getOrderById: (orderId: string) => PurchaseOrder | undefined;
  refreshOrders: () => Promise<void>;
}

const PurchaseHistoryContext = createContext<PurchaseHistoryContextType | undefined>(undefined);

export const PurchaseHistoryProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [beOrders, setBeOrders] = useState<BeOrder[]>([]);
  const [localOrders, setLocalOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!user?.customerId) return;
    setIsLoading(true);
    try {
      const data = await getOrdersByCustomer(user.customerId);
      setBeOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.customerId]);

  useEffect(() => {
    if (isAuthenticated && user?.customerId) {
      refreshOrders();
    } else {
      setBeOrders([]);
      setLocalOrders([]);
    }
  }, [isAuthenticated, user?.customerId, refreshOrders]);

  const orders: PurchaseOrder[] = [
    ...beOrders.map(mapBeOrder),
    ...localOrders.filter(lo => !beOrders.some(bo => String(bo.orderId) === lo.id)),
  ];

  const addOrder = (order: PurchaseOrder) => {
    setLocalOrders(prev => [order, ...prev]);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <PurchaseHistoryContext.Provider value={{
      orders,
      beOrders,
      isLoading,
      addOrder,
      getOrderById,
      refreshOrders,
    }}>
      {children}
    </PurchaseHistoryContext.Provider>
  );
};

export const usePurchaseHistory = () => {
  const context = useContext(PurchaseHistoryContext);
  if (!context) {
    throw new Error("usePurchaseHistory must be used within PurchaseHistoryProvider");
  }
  return context;
};
