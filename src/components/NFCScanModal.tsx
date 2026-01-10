import { Card } from "@/types/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Smartphone, Waves, CheckCircle2, Sparkles } from "lucide-react";

interface NFCScanModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: () => void;
}

const NFCScanModal = ({ card, isOpen, onClose, onScanComplete }: NFCScanModalProps) => {
  const [scanStatus, setScanStatus] = useState<"ready" | "scanning" | "success">("ready");
  const [showStory, setShowStory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScanStatus("ready");
      setShowStory(false);
    }
  }, [isOpen]);

  const handleStartScan = () => {
    setScanStatus("scanning");
    
    // Giả lập quá trình quét 2.5 giây
    setTimeout(() => {
      setScanStatus("success");
      setTimeout(() => {
        setShowStory(true);
      }, 500);
    }, 2500);
  };

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!showStory ? (
          <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8">
            {/* NFC Icon Animation */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto">
              {scanStatus === "ready" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-primary animate-pulse" />
                </div>
              )}
              
              {scanStatus === "scanning" && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Smartphone className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-primary" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 border-4 border-primary rounded-full animate-ping" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-primary/50 rounded-full animate-pulse" />
                  </div>
                  <Waves className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary animate-bounce" />
                </>
              )}
              
              {scanStatus === "success" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <CheckCircle2 className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-green-500 animate-scale-in" />
                    <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-green-500 rounded-full animate-ping" />
                  </div>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {scanStatus === "ready" && (
              <>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2">{card.name}</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{card.mythology}</p>
                  <Badge className="bg-primary text-xs sm:text-sm">{card.rarity}</Badge>
                </div>
                <img 
                  src={card.image} 
                  alt={card.name}
                  className="w-40 h-60 sm:w-48 sm:h-72 object-cover rounded-xl mx-auto shadow-2xl animate-float"
                />
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-base sm:text-lg text-foreground">
                    Đặt thẻ vào gần điện thoại để quét
                  </p>
                  <Button
                    size="lg"
                    onClick={handleStartScan}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow px-6 sm:px-8"
                  >
                    <Waves className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-sm sm:text-base">Bắt đầu quét NFC</span>
                  </Button>
                </div>
              </>
            )}

            {scanStatus === "scanning" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-primary animate-pulse">
                  Đang quét thẻ...
                </h3>
                <p className="text-muted-foreground">
                  Giữ thẻ ở vị trí cho đến khi hoàn tất
                </p>
                <div className="flex justify-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {scanStatus === "success" && !showStory && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-2xl font-semibold text-green-500">
                  ✓ Quét thành công!
                </h3>
                <p className="text-muted-foreground">
                  Đang tải câu chuyện...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {/* Story Content */}
            <div className="relative">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-3 sm:mb-4 blur-sm opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="inline-flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary animate-pulse" />
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-shadow-glow">
                      {card.name}
                    </h2>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary animate-pulse" />
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{card.mythology}</p>
                  <Badge className="mt-2 bg-primary text-xs sm:text-sm">{card.rarity}</Badge>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-500 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Thẻ NFC đã được xác thực thành công!
              </p>
            </div>

            {/* Full Story */}
            <div className="prose prose-invert max-w-none">
              <div className="space-y-4">
                {card.story.full.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                onClick={() => {
                  onScanComplete();
                  onClose();
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Lưu vào bộ sưu tập
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NFCScanModal;