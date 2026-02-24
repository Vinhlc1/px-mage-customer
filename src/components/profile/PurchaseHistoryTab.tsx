import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { PurchaseOrder } from "@/contexts/PurchaseHistoryContext";
import { formatVND } from "@/lib/utils";

interface PurchaseHistoryTabProps {
  orders: PurchaseOrder[];
}

export default function PurchaseHistoryTab({ orders }: PurchaseHistoryTabProps) {
  return (
    <div className="card-glass p-8">
      <h2 className="text-3xl font-serif font-bold mb-6">Purchase History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No purchase history yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Start your journey by purchasing some cards!
          </p>
          <Link href="/marketplace">
            <Button className="mt-4">
              Browse Marketplace
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card-glass p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
                      <div className="relative w-12 h-12">
                        <Image 
                          src={item.cardImage} 
                          alt={item.cardName}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.cardName}</p>
                        <Badge variant="outline" className="text-xs">{item.rarity}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">× {item.quantity}</p>
                        <p className="font-medium">{formatVND(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>{formatVND(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping:</span>
                  <span>{formatVND(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax:</span>
                  <span>{formatVND(order.tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-primary">{formatVND(order.total)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" size="sm">
                  Buy Again
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
