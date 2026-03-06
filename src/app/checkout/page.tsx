"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/contexts/CollectionContext";
import { usePurchaseHistory } from "@/contexts/PurchaseHistoryContext";
import { useToast } from "@/hooks/use-toast";
import { getCardTemplate, mapCardTemplate } from "@/lib/api/cards";
import { createOrder } from "@/lib/api/orders";
import { formatVND } from "@/lib/utils";
import { Card } from "@/types/card";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Lock,
    MapPin,
    Package,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Step = "shipping" | "payment";

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "shipping", label: "Shipping", icon: <MapPin className="w-4 h-4" /> },
  { key: "payment", label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-8 sm:mb-10">
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : done
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 transition-all ${
                  i < idx ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get("templateId");
  const quantityParam = searchParams.get("quantity");

  const { toast } = useToast();
  const { refreshOwnedCards } = useCollection();
  const { addOrder, refreshOrders } = usePurchaseHistory();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<Step>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);

  const [card, setCard] = useState<Card | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [shipping, setShipping] = useState({
    name: user?.username ?? "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    note: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
        router.push("/login?redirect=/checkout");
        return;
    }
    if (!templateIdParam) {
      setIsLoading(false);
      return;
    }

    const tid = Number(templateIdParam);
    const qty = Number(quantityParam) || 1;
    setQuantity(qty);

    getCardTemplate(tid)
      .then((tpl) => setCard(mapCardTemplate(tpl)))
      .catch(() => setCard(null))
      .finally(() => setIsLoading(false));
  }, [templateIdParam, quantityParam, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4 text-muted-foreground">
        <div className="w-10 h-10 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-4">
        <Package className="w-16 h-16 mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-serif font-bold">No Item Selected</h1>
        <p className="text-muted-foreground">Please select a card from the marketplace to purchase.</p>
        <Button className="bg-primary hover:bg-primary/90 mt-4" onClick={() => router.push("/marketplace")}>
          Browse Marketplace
        </Button>
      </div>
    );
  }

  const subtotal = card.price * quantity;
  const total = subtotal;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!user?.accountId) {
        router.push("/login?redirect=/checkout");
        return;
      }

      const shippingAddress = `${shipping.name}, ${shipping.address}, ${shipping.city} ${shipping.postalCode}, Tel: ${shipping.phone}`;

      const beOrder = await createOrder({
        paymentGateway: "COD",
        shippingAddress,
        shippingPhone: shipping.phone || "",
        items: [{
          cardTemplateId: Number(card.id),
          productType: "SINGLE_CARD",
          productName: card.name,
          quantity: quantity,
          unitPrice: card.price,
        }],
      });

      addOrder({
        id: String(beOrder.orderId),
        date: beOrder.createdAt || new Date().toISOString(),
        items: [{
          cardId: card.id,
          cardName: card.name,
          cardImage: typeof card.image === "string" ? card.image : "",
          quantity: quantity,
          price: card.price,
          rarity: card.rarity,
        }],
        subtotal,
        shipping: 0,
        tax: 0,
        total,
        status: "pending",
        paymentMethod: "COD",
      });

      await Promise.all([refreshOwnedCards().catch(() => {}), refreshOrders().catch(() => {})]);

      toast({
        title: "Đặt hàng thành công! 🎉",
        description: `Order #${beOrder.orderId} confirmed. We'll process it shortly.`,
      });
      router.push("/orders");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({
        title: "Đặt hàng thất bại",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderShippingStep = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStep("payment");
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="s-name">Full Name *</Label>
          <Input
            id="s-name"
            placeholder="Nguyen Van A"
            required
            value={shipping.name}
            onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-email">Email *</Label>
          <Input
            id="s-email"
            type="email"
            placeholder="you@example.com"
            required
            value={shipping.email}
            onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-phone">Phone Number *</Label>
        <Input
          id="s-phone"
          type="tel"
          placeholder="+84 xxx xxx xxx"
          required
          value={shipping.phone}
          onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-address">Street Address *</Label>
        <Input
          id="s-address"
          placeholder="123 Nguyen Hue, Ward 1"
          required
          value={shipping.address}
          onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="s-city">City *</Label>
          <Input
            id="s-city"
            placeholder="Ho Chi Minh City"
            required
            value={shipping.city}
            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-postal">Postal Code *</Label>
          <Input
            id="s-postal"
            placeholder="70000"
            required
            value={shipping.postalCode}
            onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-note">Order Note (optional)</Label>
        <Input
          id="s-note"
          placeholder="Special delivery instructions..."
          value={shipping.note}
          onChange={(e) => setShipping({ ...shipping, note: e.target.value })}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
          Continue to Payment
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  );

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const renderPaymentStep = () => (
    <form onSubmit={handlePlaceOrder} className="space-y-4">
      <div className="card-glass p-3 rounded-xl text-sm space-y-1 text-muted-foreground">
        <p className="text-foreground font-medium text-xs uppercase tracking-wide mb-1">
          Delivering to
        </p>
        <p>{shipping.name}{shipping.phone ? ` · ${shipping.phone}` : ""}</p>
        <p>{[shipping.address, shipping.city, shipping.postalCode].filter(Boolean).join(", ")}</p>
      </div>

      <Separator />

      <div className="space-y-1">
        <p className="text-sm font-semibold flex items-center gap-1.5">
          <CreditCard className="w-4 h-4" /> Card Details (Optional COD)
        </p>
        <p className="text-xs text-muted-foreground">Simulated payment &mdash; order will use COD.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="p-number">Card Number</Label>
        <Input
          id="p-number"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          value={payment.cardNumber}
          onChange={(e) =>
            setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })
          }
          className="font-mono tracking-widest"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="p-name">Name on Card</Label>
        <Input
          id="p-name"
          placeholder="NGUYEN VAN A"
          value={payment.cardName}
          onChange={(e) =>
            setPayment({ ...payment, cardName: e.target.value.toUpperCase() })
          }
          className="uppercase"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="p-expiry">Expiry (MM/YY)</Label>
          <Input
            id="p-expiry"
            placeholder="12/27"
            maxLength={5}
            value={payment.expiry}
            onChange={(e) =>
              setPayment({ ...payment, expiry: formatExpiry(e.target.value) })
            }
            className="font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-cvv">CVV</Label>
          <Input
            id="p-cvv"
            placeholder="123"
            maxLength={4}
            value={payment.cvv}
            onChange={(e) =>
              setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
            }
            className="font-mono"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setStep("shipping")}
          disabled={isProcessing}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 font-semibold"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              Placing Order...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Place Order · {formatVND(total)}
            </span>
          )}
        </Button>
      </div>
    </form>
  );

  const stepTitles: Record<Step, string> = {
    shipping: "Shipping Details",
    payment: "Payment",
  };

  return (
    <section className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2 text-center">
          Checkout
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-8">
          1 item · {formatVND(total)} total
        </p>

        <StepIndicator current={step} />

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 card-glass p-5 sm:p-8 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              {STEPS.find((s) => s.key === step)?.icon}
              <h2 className="text-xl font-serif font-bold">{stepTitles[step]}</h2>
            </div>
            {step === "shipping" && renderShippingStep()}
            {step === "payment" && renderPaymentStep()}
          </div>

          <div className="space-y-4">
            <div className="card-glass p-4 sm:p-6 space-y-4 text-sm">
              <h3 className="font-serif font-bold text-base">Order Summary</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Items (1)</span>
                  <span className="text-foreground">{formatVND(subtotal)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">{formatVND(total)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                Secure & encrypted checkout
              </div>
            </div>

            <div className="card-glass p-4 rounded-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                1 item
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="relative w-8 h-10 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={
                      typeof card.image === "string"
                        ? card.image
                        : "/placeholder-card.png"
                    }
                    alt={card.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="flex-1 truncate text-xs">{card.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  ×{quantity}
                </span>
                <span className="text-xs font-medium flex-shrink-0">
                  {formatVND(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center">Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
