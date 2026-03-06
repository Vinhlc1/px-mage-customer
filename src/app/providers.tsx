'use client';

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CollectionProvider } from "@/contexts/CollectionContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { PurchaseHistoryProvider } from "@/contexts/PurchaseHistoryContext";
import type { AuthUser } from "@/lib/auth-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";

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
      </AuthProvider>
    </QueryClientProvider>
  );
}
