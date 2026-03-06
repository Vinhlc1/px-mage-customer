"use client";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getOrderById, type BeOrder } from "@/lib/api/orders";
import { formatVND } from "@/lib/utils";
import { ArrowLeft, Lock, Package } from "lucide-react";
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

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-muted rounded w-56" />
      <div className="card-glass p-6 rounded-xl space-y-4">
        <div className="h-6 bg-muted rounded w-40" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-5 bg-muted rounded w-32" />
            </div>
          ))}
        </div>
      </div>
      <div className="card-glass p-6 rounded-xl space-y-3">
        <div className="h-6 bg-muted rounded w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<BeOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = Number(params.id);
    if (isNaN(id)) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    getOrderById(id)
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, params.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="starfield" />
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <Lock className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-4xl font-serif font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Bạn cần đăng nhập để xem chi tiết đơn hàng
          </p>
          <Button
            size="lg"
            onClick={() => router.push(`/login?redirect=/orders/${params.id}`)}
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
          <Button
            variant="ghost"
            className="mb-6 -ml-2"
            onClick={() => router.push("/orders")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại đơn hàng
          </Button>

          {isLoading ? (
            <DetailSkeleton />
          ) : notFound || !order ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</p>
              <p className="text-muted-foreground mb-6">
                Đơn hàng này không tồn tại hoặc bạn không có quyền xem.
              </p>
              <Button onClick={() => router.push("/orders")}>
                Xem tất cả đơn hàng
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-serif font-bold">
                Đơn hàng #{order.orderId}
              </h1>

              {/* Order Status */}
              <div className="card-glass p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ngày đặt hàng</p>
                    <p className="font-medium mt-1">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trạng thái đơn hàng</p>
                    <div className="mt-1">
                      <Badge variant={orderStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trạng thái thanh toán</p>
                    <div className="mt-1">
                      <Badge variant={paymentStatusVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  {order.paymentGateway && (
                    <div>
                      <p className="text-muted-foreground">Phương thức thanh toán</p>
                      <p className="font-medium mt-1">{order.paymentGateway}</p>
                    </div>
                  )}
                  {order.shippingAddress && (
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">Địa chỉ giao hàng</p>
                      <p className="font-medium mt-1">{order.shippingAddress}</p>
                    </div>
                  )}

                </div>
              </div>

              {/* Order Items */}
              <div className="card-glass p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4">
                  Sản phẩm ({order.orderItems?.length ?? 0})
                </h2>
                {order.orderItems?.length > 0 ? (
                  <div className="divide-y divide-border">
                    {order.orderItems.map((item, index) => (
                      <div
                        key={item.orderItemId}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">{item.productName || `Sản phẩm #${index + 1}`}</p>
                          <p className="text-sm text-muted-foreground">
                            Số lượng: {item.quantity} × {formatVND(item.unitPrice)}
                          </p>
                        </div>
                        <p className="font-semibold text-primary">
                          {formatVND(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Không có thông tin sản phẩm
                  </p>
                )}

                {/* Total */}
                <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatVND(order.totalAmount)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => router.push("/marketplace")}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
