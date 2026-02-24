"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Package,
  Trash2,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShoppingBag,
  Lock,
  Minus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useCollection } from "@/contexts/CollectionContext";
import { usePurchaseHistory } from "@/contexts/PurchaseHistoryContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/lib/api/orders";
import { getCardTemplate } from "@/lib/api/cards";
import { formatVND } from "@/lib/utils";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Step = "cart" | "shipping" | "payment";

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "cart", label: "Cart", icon: <ShoppingBag className="w-4 h-4" /> },
  { key: "shipping", label: "Shipping", icon: <MapPin className="w-4 h-4" /> },
  { key: "payment", label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
];

// â”€â”€ Step indicator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Order summary sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OrderSummary({
  subtotal,
  total,
  itemCount,
}: {
  subtotal: number;
  total: number;
  itemCount: number;
}) {
  return (
    <div className="card-glass p-4 sm:p-6 space-y-4 text-sm">
      <h3 className="font-serif font-bold text-base">Order Summary</h3>
      <div className="space-y-2 text-muted-foreground">
        <div className="flex justify-between">
          <span>Items ({itemCount})</span>
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
  );
}

// â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Checkout = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { cart, clearCart, getCartTotal, removeFromCart, updateQuantity } = useCart();
  const { refreshOwnedCards } = useCollection();
  const { addOrder, refreshOrders } = usePurchaseHistory();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>("cart");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const subtotal = getCartTotal();
  const total = subtotal;
  const itemCount = cart.reduce((n, i) => n + i.quantity, 0);

  // â”€â”€ Empty cart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (cart.length === 0 && step !== "payment") {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center space-y-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-serif font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground">Add some cards before checking out.</p>
          <Button className="bg-primary hover:bg-primary/90 mt-4" onClick={() => router.push("/marketplace")}>
            Browse Marketplace
          </Button>
        </div>
      </div>
    );
  }

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!user?.customerId) {
        router.push("/login?redirect=/checkout");
        return;
      }

      // ── Stock pre-check (race-condition guard) ───────────────────────────
      const stockIssues: string[] = [];
      await Promise.all(
        cart.map(async (item) => {
          try {
            const templateId = item.card.templateId ?? Number(item.card.id);
            const tpl = await getCardTemplate(templateId);
            const available = tpl.cards?.length ?? 0;
            if (available < item.quantity) {
              stockIssues.push(
                `${item.card.name}: cần ${item.quantity}, còn lại ${available}`
              );
            }
          } catch {
            // Cannot check → let BE decide
          }
        })
      );

      if (stockIssues.length > 0) {
        toast({
          title: "Một số thẻ đã hết hàng ⚠️",
          description: stockIssues.join(" | "),
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      // ─────────────────────────────────────────────────────────────────────

      const shippingAddress = `${shipping.name}, ${shipping.address}, ${shipping.city} ${shipping.postalCode}, Tel: ${shipping.phone}`;

      const beOrder = await createOrder({
        customerId: user.customerId,
        orderDate: new Date().toISOString(),
        status: "PENDING",
        totalAmount: total,
        shippingAddress,
        paymentMethod: "CARD",
        paymentStatus: "PENDING",
        notes: `Email: ${shipping.email}${shipping.note ? ` | Note: ${shipping.note}` : ""}`,
        orderItems: cart.map((item) => ({
          cardId: item.card.cardId ?? Number(item.card.id),
          quantity: item.quantity,
          unitPrice: item.card.price,
          subtotal: item.card.price * item.quantity,
        })),
      });

      addOrder({
        id: String(beOrder.orderId),
        date: beOrder.orderDate,
        items: cart.map((item) => ({
          cardId: item.card.id,
          cardName: item.card.name,
          cardImage: typeof item.card.image === "string" ? item.card.image : "",
          quantity: item.quantity,
          price: item.card.price,
          rarity: item.card.rarity,
        })),
        subtotal,
        shipping: 0,
        tax: 0,
        total,
        status: "pending",
        paymentMethod: "Card",
      });

      await Promise.all([refreshOwnedCards().catch(() => {}), refreshOrders().catch(() => {})]);
      clearCart();

      toast({
        title: "Đặt hàng thành công! 🎉",
        description: `Order #${beOrder.orderId} confirmed. We'll process it shortly.`,
      });
      router.push("/profile?tab=history");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      const isConflict =
        msg.includes("409") ||
        msg.toLowerCase().includes("conflict") ||
        msg.toLowerCase().includes("stock") ||
        msg.toLowerCase().includes("sold out") ||
        msg.toLowerCase().includes("unavailable");
      toast({
        title: isConflict ? "Thẻ vừa hết hàng ⚠️" : "Đặt hàng thất bại",
        description: isConflict
          ? "Một hoặc nhiều thẻ đã được mua bởi người khác ngay trước. Vui lòng cập nhật giỏ hàng."
          : msg,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // â”€â”€ Step: Cart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderCartStep = () => (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.card.id} className="card-glass flex gap-3 p-3 rounded-xl">
            <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={typeof item.card.image === "string" ? item.card.image : "/placeholder-card.png"}
                alt={item.card.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{item.card.name}</h3>
              <Badge variant="secondary" className="text-xs mt-0.5">
                {item.card.rarity}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {formatVND(item.card.price)} each
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-sm w-4 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removeFromCart(item.card.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <span className="font-bold text-sm text-primary">
                {formatVND(item.card.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Button
        className="w-full bg-primary hover:bg-primary/90 mt-2"
        onClick={() => setStep("shipping")}
      >
        Continue to Shipping
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );

  // â”€â”€ Step: Shipping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
          onClick={() => setStep("cart")}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
          Continue to Payment
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  );

  // â”€â”€ Step: Payment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderPaymentStep = () => (
    <form onSubmit={handlePlaceOrder} className="space-y-4">
      {/* Shipping recap */}
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
          <CreditCard className="w-4 h-4" /> Card Details
        </p>
        <p className="text-xs text-muted-foreground">Simulated payment &mdash; no real charge</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="p-number">Card Number *</Label>
        <Input
          id="p-number"
          placeholder="1234 5678 9012 3456"
          required
          maxLength={19}
          value={payment.cardNumber}
          onChange={(e) =>
            setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })
          }
          className="font-mono tracking-widest"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="p-name">Name on Card *</Label>
        <Input
          id="p-name"
          placeholder="NGUYEN VAN A"
          required
          value={payment.cardName}
          onChange={(e) =>
            setPayment({ ...payment, cardName: e.target.value.toUpperCase() })
          }
          className="uppercase"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="p-expiry">Expiry (MM/YY) *</Label>
          <Input
            id="p-expiry"
            placeholder="12/27"
            required
            maxLength={5}
            value={payment.expiry}
            onChange={(e) =>
              setPayment({ ...payment, expiry: formatExpiry(e.target.value) })
            }
            className="font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-cvv">CVV *</Label>
          <Input
            id="p-cvv"
            placeholder="123"
            required
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

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const stepTitles: Record<Step, string> = {
    cart: "Your Cart",
    shipping: "Shipping Details",
    payment: "Payment",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />

      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2 text-center">
            Checkout
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            {itemCount} item{itemCount !== 1 ? "s" : ""} · {formatVND(total)} total
          </p>

          <StepIndicator current={step} />

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main form area â€” takes 2 cols */}
            <div className="lg:col-span-2 card-glass p-5 sm:p-8 rounded-2xl">
              <div className="flex items-center gap-2 mb-6">
                {STEPS.find((s) => s.key === step)?.icon}
                <h2 className="text-xl font-serif font-bold">{stepTitles[step]}</h2>
              </div>

              {step === "cart" && renderCartStep()}
              {step === "shipping" && renderShippingStep()}
              {step === "payment" && renderPaymentStep()}
            </div>

            {/* Sidebar summary â€” always visible */}
            <div className="space-y-4">
              <OrderSummary
                subtotal={subtotal}
                total={total}
                itemCount={itemCount}
              />

              {/* Items mini list */}
              <div className="card-glass p-4 rounded-xl space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </p>
                {cart.map((item) => (
                  <div key={item.card.id} className="flex items-center gap-2 text-sm">
                    <div className="relative w-8 h-10 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={
                          typeof item.card.image === "string"
                            ? item.card.image
                            : "/placeholder-card.png"
                        }
                        alt={item.card.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="flex-1 truncate text-xs">{item.card.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      ×{item.quantity}
                    </span>
                    <span className="text-xs font-medium flex-shrink-0">
                      {formatVND(item.card.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
