"use client";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
    getCardTemplate,
    mapCardTemplate,
} from "@/lib/api/cards";
import { formatVND } from "@/lib/utils";
import { Card } from "@/types/card";
import { ArrowLeft, CreditCard, Minus, Package, Plus, Zap } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PurchasePage = () => {
  const params = useParams();
  const cardId = params?.cardId as string;
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // For physical cards, the base price is returned directly
  const unitPrice = card?.price || 0;
  const subtotal = unitPrice * quantity;
  const total = subtotal;

  useEffect(() => {
    if (!cardId) return;
    const id = Number(cardId);
    if (isNaN(id)) { setNotFound(true); setIsLoading(false); return; }

    setIsLoading(true);
    getCardTemplate(id)
      .then((tpl) => setCard(mapCardTemplate(tpl)))
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [cardId]);

  const handleBuyNow = () => {
    if (!card) return;
    if (!isAuthenticated) { router.push(`/login?redirect=/purchase/${cardId}`); return; }
    router.push(`/checkout?templateId=${cardId}&quantity=${quantity}`);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-10 h-10 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
          <p>Loading card details...</p>
        </div>
      </div>
    );
  }

  // ── Not Found ─────────────────────────────────────────────────────────────
  if (notFound || !card) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center space-y-4">
          <Package className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="text-4xl font-serif font-bold">Card Not Found</h1>
          <p className="text-muted-foreground">This card may no longer be available.</p>
          <Button onClick={() => router.push("/marketplace")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  // ── Main content ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />

      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* ── Left: Card Visual ───────────────────────────────── */}
          <div className="space-y-6">
            <div className="card-glass overflow-hidden relative rounded-2xl aspect-[3/4] w-full max-w-sm mx-auto">
              <Image
                src={typeof card.image === "string" ? card.image : "/placeholder-card.png"}
                alt={card.name}
                fill
                className="object-cover hover-scale"
                priority
              />
            </div>

            <div className="card-glass p-5 rounded-2xl space-y-3">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">{card.name}</h2>
              <p className="text-muted-foreground text-sm">{card.mythology}</p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge>{card.rarity}</Badge>
                {card.nfcEnabled && <Badge variant="outline">NFC Enabled</Badge>}
              </div>

              <Separator />

              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2">✓ Physical NFC card included</li>
                <li className="flex items-center gap-2">✓ Tap to unlock digital story</li>
                <li className="flex items-center gap-2">✓ Unique card ID authentication</li>
                <li className="flex items-center gap-2">✓ Collectible artwork</li>
              </ul>
            </div>
          </div>

          {/* ── Right: Purchase Panel ────────────────────────────── */}
          <div className="card-glass p-6 rounded-2xl space-y-6 h-fit">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium mb-1">Unit Price</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-primary">{formatVND(unitPrice)}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-2xl font-bold w-10 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Order summary */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính ({quantity}×)</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatVND(total)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-1">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6 font-semibold"
                onClick={handleBuyNow}
              >
                <Zap className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <CreditCard className="w-3.5 h-3.5" />
              Secure checkout · Simulated payment
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PurchasePage;
