import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react";
import { UserCollection } from "@/types/card";

interface CollectionContextType {
  collection: UserCollection;
  addCardToCollection: (cardId: string) => void;
  removeCardFromCollection: (cardId: string) => void;
  markSeriesCompleted: (seriesId: string) => void;
  hasCard: (cardId: string) => boolean;
  hasPurchased: (cardId: string) => boolean;
  isSeriesCompleted: (seriesId: string) => boolean;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const [collection, setCollection] = useState<UserCollection>({
    collectedCards: [],
    completedSeries: [],
    purchasedCards: []
  });

  // Load demo user cards on mount
  useEffect(() => {
    const demoCards = localStorage.getItem('demo_user_cards');
    if (demoCards) {
      try {
        const cardIds = JSON.parse(demoCards);
        setCollection(prev => ({
          ...prev,
          purchasedCards: cardIds
        }));
      } catch (e) {
        console.error('Failed to load demo cards', e);
      }
    }
  }, []);

  const addCardToCollection = useCallback((cardId: string) => {
    setCollection(prev => ({
      ...prev,
      collectedCards: prev.collectedCards.includes(cardId) 
        ? prev.collectedCards 
        : [...prev.collectedCards, cardId],
      // Auto add to purchased when adding to collection
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
      addCardToCollection,
      removeCardFromCollection,
      markSeriesCompleted,
      hasCard,
      hasPurchased,
      isSeriesCompleted
    }), [collection, addCardToCollection, removeCardFromCollection, markSeriesCompleted, hasCard, hasPurchased, isSeriesCompleted]);

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
