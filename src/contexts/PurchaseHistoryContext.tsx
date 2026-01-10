import { createContext, useContext, useState, ReactNode } from "react";

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

interface PurchaseHistoryContextType {
  orders: PurchaseOrder[];
  addOrder: (order: PurchaseOrder) => void;
  getOrderById: (orderId: string) => PurchaseOrder | undefined;
}

const PurchaseHistoryContext = createContext<PurchaseHistoryContextType | undefined>(undefined);

export const PurchaseHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  const addOrder = (order: PurchaseOrder) => {
    setOrders(prev => [order, ...prev]); // Add new order at the beginning
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <PurchaseHistoryContext.Provider value={{
      orders,
      addOrder,
      getOrderById
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
