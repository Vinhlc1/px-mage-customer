"use client";

import { useState, useEffect } from "react";
import { Card } from "@/types/card";
import { fetchCardTemplatesWithPrices } from "@/lib/api/cards";
import { toast } from "@/hooks/use-toast";

interface UseCardTemplatesResult {
  cards: Card[];
  isLoading: boolean;
}

/**
 * Fetches all card templates with prices from the BE.
 * Handles loading state, error toast, and cleanup on unmount.
 */
export function useCardTemplates(): UseCardTemplatesResult {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchCardTemplatesWithPrices()
      .then((result) => {
        if (!cancelled) setCards(result);
      })
      .catch((err) => {
        console.error("Failed to load card templates", err);
        toast({
          title: "Không thể tải danh sách thẻ",
          description: String(err),
          variant: "destructive",
        });
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { cards, isLoading };
}
