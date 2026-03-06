"use client";

import { BeOrder, getMyOrders } from "@/lib/api/orders";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
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
    date: order.createdAt || new Date().toISOString(),
    items: (order.orderItems ?? []).map(item => ({
      cardId: String(item.orderItemId),
      cardName: item.productName || `Card #${item.orderItemId}`,
      cardImage: "",
      quantity: item.quantity || 1,
      price: Number(item.unitPrice || 0),
      rarity: "Common",
    })),
    subtotal: Number(order.totalAmount),
    shipping: 0,
    tax: 0,
    total: Number(order.totalAmount),
    status: order.status === "DELIVERED" ? "completed"
      : order.status === "CANCELLED" ? "cancelled"
      : "pending",
    paymentMethod: order.paymentGateway ?? "COD",
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
  const { isAuthenticated } = useAuth();
  const [beOrders, setBeOrders] = useState<BeOrder[]>([]);
  const [localOrders, setLocalOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await getMyOrders();
      setBeOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshOrders();
    } else {
      setBeOrders([]);
      setLocalOrders([]);
    }
  }, [isAuthenticated, refreshOrders]);

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
