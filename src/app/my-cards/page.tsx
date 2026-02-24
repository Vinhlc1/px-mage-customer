"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NFCScanModal from "@/components/NFCScanModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/types/card";
import { useCollection } from "@/contexts/CollectionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Waves, ShoppingBag, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BePhysicalCard } from "@/lib/api/collections";

/** Map a BE physical card to the FE Card type */
function mapPhysicalCard(c: BePhysicalCard): Card {
  return {
    id: String(c.cardId),
    cardId: c.cardId,
    nfcUuid: c.nfcUuid,
    name: `Card #${c.cardId}`,
    mythology: "PixelMage",
    image: "/placeholder-card.png",
    rarity: "Common",
    price: 0,
    nfcEnabled: true,
  };
}

const MyCards = () => {
  const router = useRouter();
  const { collection, hasPurchased, ownedCards, isLoading: isLoadingCards } = useCollection();
  const { isAuthenticated } = useAuth();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isNFCScanModalOpen, setIsNFCScanModalOpen] = useState(false);

  // Use real owned cards from BE
  const purchasedCards: Card[] = ownedCards.map(mapPhysicalCard);

  const handleNFCScan = (card: Card) => {
    setSelectedCard(card);
    setIsNFCScanModalOpen(true);
  };

  const handleScanComplete = () => {
    toast({
      title: "Thành công!",
      description: "Thẻ đã được xác thực và thêm vào bộ sưu tập",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <Lock className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-4xl font-serif font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Bạn cần đăng nhập để xem thẻ của mình
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90"
          >
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />

      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-4 text-gradient-gold">
            Thẻ Của Tôi
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6">
            Quản lý và quét NFC các thẻ bạn đã mua
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
            <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 sm:px-6 py-2 sm:py-3">
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {isLoadingCards ? "..." : purchasedCards.length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Thẻ đã mua</p>
            </div>
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg px-4 sm:px-6 py-2 sm:py-3">
              <p className="text-2xl sm:text-3xl font-bold text-secondary">{collection.collectedCards.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Đã quét NFC</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {isLoadingCards ? (
          <div className="text-center py-20 text-muted-foreground">Loading your cards...</div>
        ) : purchasedCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {purchasedCards.map((card) => (
              <div
                key={card.id}
                className="group relative rounded-xl overflow-hidden card-glow bg-card border border-border"
              >
                <div className="relative aspect-2/3 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute top-3 right-3 bg-primary">
                    {card.rarity}
                  </Badge>
                  {card.nfcEnabled && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-green-500 text-white">
                        <Waves className="w-3 h-3 mr-1" />
                        NFC
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-1">
                      {card.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{card.mythology}</p>
                  </div>

                  {card.nfcEnabled && (
                    <Button
                      onClick={() => handleNFCScan(card)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="lg"
                    >
                      <Waves className="w-5 h-5 mr-2" />
                      Quét thẻ NFC
                    </Button>
                  )}

                  <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                    Đã mua • ${card.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-3xl font-serif font-bold mb-4">Chưa có thẻ nào</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Bạn chưa mua thẻ nào. Hãy khám phá marketplace!
            </p>
            <Button 
              size="lg" 
              onClick={() => router.push("/marketplace")}
              className="bg-primary hover:bg-primary/90"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Đi đến Marketplace
            </Button>
          </div>
        )}
      </section>

      <NFCScanModal
        card={selectedCard}
        isOpen={isNFCScanModalOpen}
        onClose={() => setIsNFCScanModalOpen(false)}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
};

export default MyCards;