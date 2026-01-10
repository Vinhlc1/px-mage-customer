import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, BookOpen } from "lucide-react";
import { Card } from "@/types/card";
import EmptyState from "@/components/EmptyState";

interface InventoryTabProps {
  userCards: Card[];
}

export default function InventoryTab({ userCards }: InventoryTabProps) {
  return (
    <div className="card-glass p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold">My Card Collection</h2>
        <Link href="/collection">
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">View Collection & Stories</span>
            <span className="sm:hidden">View Collection</span>
          </Button>
        </Link>
      </div>
      
      {userCards.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Your collection is empty"
          description="Purchase cards to start your collection!"
          actionLabel="Browse Marketplace"
          onAction={() => window.location.href = "/marketplace"}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {userCards.map((card) => (
            <div key={card.id} className="card-glass overflow-hidden hover-scale">
              <div className="relative w-full h-48">
                <Image src={card.image} alt={card.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-serif font-bold mb-2">{card.name}</h3>
                <Badge variant={card.rarity === "Legendary" ? "default" : "secondary"}>
                  {card.rarity}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">NFC Enabled ✓</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
