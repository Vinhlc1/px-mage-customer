"use client";

import { BeInventoryItem, getMyInventory } from "@/lib/api/collections";
import { UserCollection } from "@/types/card";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

interface CollectionContextType {
  collection: UserCollection;
  ownedCards: BeInventoryItem[];
  isLoading: boolean;
  addCardToCollection: (cardId: string) => void;
  removeCardFromCollection: (cardId: string) => void;
  markSeriesCompleted: (seriesId: string) => void;
  hasCard: (cardId: string) => boolean;
  hasPurchased: (cardId: string) => boolean;
  isSeriesCompleted: (seriesId: string) => boolean;
  refreshOwnedCards: () => Promise<void>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();

  const [collection, setCollection] = useState<UserCollection>({
    collectedCards: [],
    completedSeries: [],
    purchasedCards: []
  });
  const [ownedCards, setOwnedCards] = useState<BeInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshOwnedCards = useCallback(async () => {
    // getMyInventory doesn't need an ID in the URL, it reads the User header
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const cards = await getMyInventory();
      setOwnedCards(cards);
      // Update purchasedCards set from real BE data based on template ID
      setCollection(prev => ({
        ...prev,
        purchasedCards: cards.map(c => String(c.cardTemplateId))
      }));
    } catch (err) {
      console.error("Failed to load owned cards", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load owned cards whenever auth changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshOwnedCards();
    } else {
      setOwnedCards([]);
      setCollection({ collectedCards: [], completedSeries: [], purchasedCards: [] });
    }
  }, [isAuthenticated, refreshOwnedCards]);

  const addCardToCollection = useCallback((cardId: string) => {
    setCollection(prev => ({
      ...prev,
      collectedCards: prev.collectedCards.includes(cardId)
        ? prev.collectedCards
        : [...prev.collectedCards, cardId],
      purchasedCards: prev.purchasedCards.includes(cardId)
        ? prev.purchasedCards
        : [...prev.purchasedCards, cardId]
    }));
  }, []);

  const removeCardFromCollection = useCallback((cardId: string) => {
    setCollection(prev => ({
      ...prev,
      collectedCards: prev.collectedCards.filter(id => id !== cardId)
    }));
  }, []);

  const markSeriesCompleted = useCallback((seriesId: string) => {
    setCollection(prev => ({
      ...prev,
      completedSeries: prev.completedSeries.includes(seriesId)
        ? prev.completedSeries
        : [...prev.completedSeries, seriesId]
    }));
  }, []);

  const hasCard = useCallback((cardId: string) => {
    return collection.collectedCards.includes(cardId);
  }, [collection.collectedCards]);

  const hasPurchased = useCallback((cardId: string) => {
    return collection.purchasedCards.includes(cardId);
  }, [collection.purchasedCards]);

  const isSeriesCompleted = useCallback((seriesId: string) => {
    return collection.completedSeries.includes(seriesId);
  }, [collection.completedSeries]);

  const value = useMemo(() => ({
    collection,
    ownedCards,
    isLoading,
    addCardToCollection,
    removeCardFromCollection,
    markSeriesCompleted,
    hasCard,
    hasPurchased,
    isSeriesCompleted,
    refreshOwnedCards,
  }), [collection, ownedCards, isLoading, addCardToCollection, removeCardFromCollection, markSeriesCompleted, hasCard, hasPurchased, isSeriesCompleted, refreshOwnedCards]);

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used within CollectionProvider");
  }
  return context;
};
