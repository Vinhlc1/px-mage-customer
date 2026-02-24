'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { CollectionProvider } from "@/contexts/CollectionContext";
import { PurchaseHistoryProvider } from "@/contexts/PurchaseHistoryContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import { ReactNode, useState } from "react";
import type { AuthUser } from "@/lib/auth-utils";

type ProvidersProps = {
  children: ReactNode;
  /** Server-read session cookie passed from layout.tsx */
  initialUser: AuthUser | null;
};

export function Providers({ children, initialUser }: ProvidersProps) {
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
      <AuthProvider initialUser={initialUser}>
        <CartProvider>
          <CollectionProvider>
            <PurchaseHistoryProvider>
              <CommunityProvider>
                <TooltipProvider>
                  <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="dark"
                  />
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
