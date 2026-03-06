"use client";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BeOrder, getMyOrders } from "@/lib/api/orders";
import { formatVND } from "@/lib/utils";
import { ChevronRight, Lock, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function orderStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "COMPLETED") return "default";
  if (status === "PROCESSING") return "secondary";
  if (status === "CANCELLED") return "destructive";
  return "outline";
}

function paymentStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "PAID") return "default";
  if (status === "REFUNDED") return "secondary";
  if (status === "FAILED") return "destructive";
  return "outline";
}

function OrderSkeleton() {
  return (
    <div className="card-glass p-5 rounded-xl space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-32" />
          <div className="h-3 bg-muted rounded w-48" />
        </div>
        <div className="h-6 bg-muted rounded w-20" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 bg-muted rounded w-28" />
        <div className="h-8 bg-muted rounded w-24" />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<BeOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <Lock className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-4xl font-serif font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Bạn cần đăng nhập để xem lịch sử đơn hàng
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/login?redirect=/orders")}
            className="bg-primary hover:bg-primary/90"
          >
            Đăng nhập
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">
            Đơn hàng của tôi
          </h1>
          <p className="text-muted-foreground mb-8">
            Theo dõi tất cả đơn hàng bạn đã đặt
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <OrderSkeleton key={i} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</p>
              <p className="text-muted-foreground mb-6">
                Hãy khám phá thẻ bài và đặt hàng ngay!
              </p>
              <Button
                onClick={() => router.push("/marketplace")}
                className="bg-primary hover:bg-primary/90"
              >
                Mua thẻ ngay
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.orderId}
                  href={`/orders/${order.orderId}`}
                  className="block card-glass p-5 rounded-xl hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-lg">
                        Đơn hàng #{order.orderId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={orderStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge variant={paymentStatusVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">
                      {formatVND(order.totalAmount)}
                    </span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {order.orderItems?.length ?? 0} sản phẩm
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
