"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Package, Minus, Plus } from "lucide-react";
import { cards, cardPacks } from "@/data/cards";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const Purchase = () => {
  const params = useParams();
  const cardId = params?.cardId as string;
  const router = useRouter();
  const { toast } = useToast();  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("single");

  const card = cards.find(c => c.id === cardId);

  if (!card) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Card Not Found</h1>
          <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
        </div>
      </div>
    );
  }

  const subtotal = selectedTab === "single" ? card.price * quantity : 0;

  const handleAddToCart = () => {
    addToCart(card, quantity);
    toast({
      title: "Added to Cart! 🛒",
      description: `${quantity}x ${card.name} added to your cart`,
    });
  };  const handleBuyNow = () => {
    // Add to cart and redirect to checkout
    addToCart(card, quantity);
    toast({
      title: "Added to Cart! 🛒",
      description: `${quantity}x ${card.name} added to cart. Redirecting to checkout...`,
    });
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Left Column - Product Display */}
            <div className="space-y-6">
              <div className="card-glass overflow-hidden relative h-96">
                <Image 
                  src={card.image} 
                  alt={card.name}
                  fill
                  className="object-cover hover-scale"
                />
              </div>
              
              <div className="card-glass p-4 sm:p-6 space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold">{card.name}</h2>
                <p className="text-muted-foreground">{card.mythology}</p>
                
                <div className="flex items-center gap-4">
                  <Badge className="text-lg py-1 px-3">{card.rarity}</Badge>
                  {card.nfcEnabled && (
                    <Badge variant="outline" className="text-lg py-1 px-3">
                      NFC Enabled
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    ✓ Physical NFC card included
                  </div>
                  <div className="flex items-center gap-2">
                    ✓ Tap to reveal digital story
                  </div>
                  <div className="flex items-center gap-2">
                    ✓ Unique card ID authentication
                  </div>
                  <div className="flex items-center gap-2">
                    ✓ Collectible artwork
                  </div>
                </div>

                {card.stock && (
                  <p className="text-sm text-primary">
                    Only {card.stock} remaining in stock!
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Purchase Options */}
            <div className="card-glass p-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single Card</TabsTrigger>
                  <TabsTrigger value="packs">Card Packs</TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">Price:</span>
                      <span className="text-3xl font-bold text-primary">
                        ${card.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(Math.min(5, quantity + 1))}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">Maximum 5 per card</p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl">Subtotal:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Free shipping over $50
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full text-lg py-6"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="packs" className="space-y-4 mt-6">
                  {cardPacks.map((pack) => (
                    <div 
                      key={pack.id}
                      className="border border-border rounded-lg p-4 space-y-3 hover:border-primary transition-colors"
                    >
                      {pack.badge && (
                        <Badge className="mb-2">{pack.badge}</Badge>
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{pack.name}</h3>
                          <p className="text-sm text-muted-foreground">{pack.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ${pack.price.toFixed(2)}
                          </div>
                          {pack.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              ${pack.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>Contains: {pack.cardCount} cards{pack.bonusCards > 0 && ` + ${pack.bonusCards} bonus`}</p>
                        <div className="text-xs text-muted-foreground">
                          Rarity odds:
                          {Object.entries(pack.rarityOdds).map(([rarity, odds]) => (
                            <span key={rarity} className="ml-2">
                              {rarity}: {odds}%
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Pack Added! 🎁",
                            description: `${pack.name} added to your cart`,
                          });
                        }}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Add Pack to Cart
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Purchase;
