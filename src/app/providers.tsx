'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { CollectionProvider } from "@/contexts/CollectionContext";
import { PurchaseHistoryProvider } from "@/contexts/PurchaseHistoryContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ReactNode, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <CollectionProvider>
            <PurchaseHistoryProvider>
              <CommunityProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  {children}
                </TooltipProvider>
              </CommunityProvider>
            </PurchaseHistoryProvider>
          </CollectionProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
