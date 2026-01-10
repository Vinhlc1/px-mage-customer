import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardImage: string;
  currentBid: number;
  minIncrement: number;
}

const BidModal = ({
  isOpen,
  onClose,
  cardName,
  cardImage,
  currentBid,
  minIncrement,
}: BidModalProps) => {
  const { toast } = useToast();
  const minimumBid = currentBid + minIncrement;
  const [bidAmount, setBidAmount] = useState(minimumBid);

  const handleBidChange = (value: string) => {
    const numValue = parseFloat(value) || minimumBid;
    setBidAmount(numValue);
  };

  const handleQuickAdd = (amount: number) => {
    setBidAmount(prev => prev + amount);
  };

  const handleConfirmBid = () => {
    if (bidAmount < minimumBid) {
      toast({
        title: "Invalid Bid",
        description: `Minimum bid is $${minimumBid.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bid Placed Successfully! 🎉",
      description: `Your bid of $${bidAmount.toFixed(2)} for ${cardName} has been placed`,
    });
    onClose();  };  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border max-h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              Place Your Bid - {cardName}
            </DialogTitle>
            <DialogDescription>
              Enter your bid amount to participate in this auction
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <ScrollArea className="flex-1 px-6 max-h-[50vh]">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-center">
              <img 
                src={cardImage} 
                alt={cardName}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Bid:</span>
                <span className="font-semibold">${currentBid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum Bid:</span>
                <span className="font-semibold text-primary">${minimumBid.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <label className="text-xs sm:text-sm font-medium">Your Bid Amount:</label>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">$</span>
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => handleBidChange(e.target.value)}
                  step="0.01"
                  min={minimumBid}
                  className="text-lg sm:text-xl font-bold"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(5)}
                  className="flex-1 min-w-[70px]"
                >
                  +$5
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(10)}
                  className="flex-1 min-w-[70px]"
                >
                  +$10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(25)}
                  className="flex-1 min-w-[70px]"
                >
                  +$25
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(50)}
                  className="flex-1 min-w-[70px]"
                >
                  +$50
                </Button>
              </div>
            </div>

            <div className="bg-secondary/20 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Bid Requirements:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Minimum: ${minimumBid.toFixed(2)}</li>
                    <li>You will be charged if you win</li>
                    <li>Bids cannot be retracted</li>                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4" />
                <span className="text-muted-foreground">Payment Method:</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" checked readOnly />
                <span>PayOS - Visa ****1234</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Payment processed only if you win
              </p>            </div>
          </div>        </ScrollArea>

        <div className="flex gap-3 p-6 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleConfirmBid}
          >
            Confirm Bid - ${bidAmount.toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BidModal;
