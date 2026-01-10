"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useCollection } from "@/contexts/CollectionContext";
import { usePurchaseHistory } from "@/contexts/PurchaseHistoryContext";
import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";

const Checkout = () => {
  const router = useRouter();
  const { toast } = useToast();  const { cart, clearCart, getCartTotal, removeFromCart, updateQuantity } = useCart();
  const { addCardToCollection } = useCollection();
  const { addOrder } = usePurchaseHistory();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 3.99;
  const tax = 0;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Your Cart is Empty</h1>
          <Button onClick={() => router.push("/marketplace")}>Browse Marketplace</Button>
        </div>
      </div>
    );
  }
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Create purchase order for history
    const purchaseOrder = {
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toISOString(),
      items: cart.map(item => ({
        cardId: item.card.id,
        cardName: item.card.name,
        cardImage: typeof item.card.image === 'string' ? item.card.image : item.card.image.src,
        quantity: item.quantity,
        price: item.card.price,
        rarity: item.card.rarity
      })),
      subtotal,
      shipping,
      tax,
      total,
      status: "completed" as const,
      paymentMethod: "PayOS - Card"
    };    // Simulate payment processing
    setTimeout(() => {
      // Add order to purchase history
      addOrder(purchaseOrder);
      
      // Auto-add cards to collection when payment successful
      cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          addCardToCollection(item.card.id);
        }
      });
      
      setIsProcessing(false);
      clearCart();
      toast({
        title: "Payment Successful! 🎉",
        description: "Your cards are on the way and have been added to your collection!",
      });
      router.push("/profile?tab=history");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      
      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-6 sm:mb-8 text-center">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Order Summary */}
            <div className="card-glass p-4 sm:p-6 h-fit space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold flex items-center gap-2">
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                Order Summary
              </h2>
              
              <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.card.id} className="flex gap-3 border border-border rounded p-3">
                    <div className="relative w-16 h-20">
                      <Image src={item.card.image} alt={item.card.name} fill className="object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.card.name}</h3>
                      <Badge variant="secondary" className="text-xs">{item.card.rarity}</Badge>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-auto"
                          onClick={() => removeFromCart(item.card.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.card.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="card-glass p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                Payment Information
              </h2>
              <form onSubmit={handlePayment} className="space-y-3 sm:space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input 
                    placeholder="123 Main St" 
                    required 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input 
                      placeholder="Denpasar" 
                      required 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input 
                      placeholder="80000" 
                      required 
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input 
                    placeholder="+62 311 89 90 19" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Payment"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
