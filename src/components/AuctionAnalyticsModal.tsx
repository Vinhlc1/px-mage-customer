import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  Eye,
  Clock
} from "lucide-react";

interface AuctionAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardImage: string;
  currentBid: number;
  startingBid: number;
}

interface BidData {
  time: string;
  price: number;
  bidder: string;
}

interface HoverData {
  x: number;
  y: number;
  price: number;
  time: string;
  bidder: string;
}

const AuctionAnalyticsModal = ({
  isOpen,
  onClose,
  cardName,
  cardImage,
  currentBid,
  startingBid,
}: AuctionAnalyticsModalProps) => {
  const [hoverData, setHoverData] = useState<HoverData | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);// Enhanced mock data for better chart visualization
  const mockBidHistory: BidData[] = [
    // Early morning bids
    { time: "08:00", price: 34.99, bidder: "EarlyBird123" },
    { time: "08:15", price: 36.50, bidder: "MorningTrader" },
    { time: "08:30", price: 35.75, bidder: "CardHunter" },
    { time: "08:45", price: 37.25, bidder: "NorseCollector" },
    
    // Morning activity
    { time: "09:00", price: 39.99, bidder: "User123" },
    { time: "09:15", price: 38.50, bidder: "VikingFan" },
    { time: "09:30", price: 42.50, bidder: "CardMaster" },
    { time: "09:45", price: 41.75, bidder: "MythologyLover" },
    
    // Mid-morning surge
    { time: "10:00", price: 45.00, bidder: "NorseGod" },
    { time: "10:15", price: 47.25, bidder: "Asgardian" },
    { time: "10:30", price: 49.99, bidder: "Viking789" },
    { time: "10:45", price: 48.50, bidder: "ThunderGod" },
    
    // Late morning competition
    { time: "11:00", price: 52.75, bidder: "Odin_Fan" },
    { time: "11:15", price: 54.99, bidder: "CardKing" },
    { time: "11:30", price: 56.25, bidder: "Thor_Lover" },
    { time: "11:45", price: 58.00, bidder: "LegendaryCollector" },
    
    // Midday intensity
    { time: "12:00", price: 60.50, bidder: "NoonBidder" },
    { time: "12:15", price: 62.98, bidder: "PremiumCollector" },
    { time: "12:30", price: 61.75, bidder: "MidDayTrader" },
    { time: "12:45", price: 64.25, bidder: "PowerBidder" },
    
    // Afternoon waves
    { time: "13:00", price: 66.50, bidder: "AfternoonWarrior" },
    { time: "13:15", price: 65.25, bidder: "SteadyBidder" },
    { time: "13:30", price: 68.75, bidder: "CardElite" },
    { time: "13:45", price: 70.00, bidder: "MaxBidder" },
    
    // Late afternoon push
    { time: "14:00", price: 72.50, bidder: "FinalPush" },
    { time: "14:15", price: 71.25, bidder: "LastChance" },
    { time: "14:30", price: 74.99, bidder: "UltimateFan" },
    { time: "14:45", price: 76.25, bidder: "EndGamePlayer" },
  ];

  const todayHigh = Math.max(...mockBidHistory.map(bid => bid.price));
  const todayLow = Math.min(...mockBidHistory.map(bid => bid.price));
  const totalBidders = new Set(mockBidHistory.map(bid => bid.bidder)).size;
  const priceChange = currentBid - startingBid;
  const priceChangePercent = ((priceChange / startingBid) * 100);
  const isPositiveTrend = priceChange > 0;
  // Simple line chart representation
  const chartPoints = mockBidHistory.map((bid, index) => {
    const x = (index / (mockBidHistory.length - 1)) * 100;
    const y = 100 - ((bid.price - todayLow) / (todayHigh - todayLow)) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Mouse handlers for chart interaction
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    
    // Find closest data point
    const closestIndex = Math.round((x / 100) * (mockBidHistory.length - 1));
    const clampedIndex = Math.max(0, Math.min(closestIndex, mockBidHistory.length - 1));
    const closestBid = mockBidHistory[clampedIndex];
    
    if (closestBid) {
      const dataX = (clampedIndex / (mockBidHistory.length - 1)) * 100;
      const dataY = 100 - ((closestBid.price - todayLow) / (todayHigh - todayLow)) * 100;
      
      setHoverData({
        x: dataX,
        y: dataY,
        price: closestBid.price,
        time: closestBid.time,
        bidder: closestBid.bidder
      });
    }
  }, [mockBidHistory, todayHigh, todayLow]);

  const handleMouseLeave = useCallback(() => {
    setHoverData(null);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-background border-border max-h-[90vh] p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" />
              Auction Analytics - {cardName}
            </DialogTitle>
            <DialogDescription>
              Real-time bidding analytics and price movements
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <ScrollArea className="flex-1 px-6 max-h-[70vh]">
          <div className="space-y-6 pb-6">
            {/* Card Info */}
            <div className="flex items-center gap-4 p-4 bg-secondary/10 rounded-lg">
              <img 
                src={cardImage} 
                alt={cardName}
                className="w-20 h-20 object-cover rounded-lg border-2 border-primary"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{cardName}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-2xl font-bold">${currentBid.toFixed(2)}</span>
                  </div>
                  <Badge variant={isPositiveTrend ? "default" : "destructive"} className="flex items-center gap-1">
                    {isPositiveTrend ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositiveTrend ? '+' : ''}{priceChangePercent.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Today High</span>
                  </div>
                  <p className="text-2xl font-bold text-green-500">${todayHigh.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Today Low</span>
                  </div>
                  <p className="text-2xl font-bold text-red-500">${todayLow.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Bidders</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{totalBidders}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Watchers</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-500">156</p>
                </CardContent>
              </Card>
            </div>

            {/* Price Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Price Movement Chart
                </CardTitle>
                <CardDescription>
                  Bidding activity throughout the day
                </CardDescription>
              </CardHeader>              <CardContent>
                <div className="relative">                  {/* Interactive SVG Chart */}
                  <div className="relative">
                    <svg 
                      ref={chartRef}
                      width="100%" 
                      height="300" 
                      viewBox="0 0 100 100" 
                      className="border rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 cursor-crosshair"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Enhanced Grid lines */}
                      <defs>
                        <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                          <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth="0.05" opacity="0.3"/>
                        </pattern>
                        <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />
                      
                      {/* Price area fill */}
                      <polygon
                        fill="url(#priceGradient)"
                        points={`0,100 ${chartPoints} 100,100`}
                      />
                      
                      {/* Price line */}
                      <polyline
                        fill="none"
                        stroke="rgb(var(--primary))"
                        strokeWidth="0.3"
                        points={chartPoints}
                      />
                      
                      {/* Enhanced data points */}
                      {mockBidHistory.map((bid, index) => {
                        const x = (index / (mockBidHistory.length - 1)) * 100;
                        const y = 100 - ((bid.price - todayLow) / (todayHigh - todayLow)) * 100;
                        return (
                          <g key={index}>
                            <circle
                              cx={x}
                              cy={y}
                              r="0.4"
                              fill="rgb(var(--primary))"
                              stroke="white"
                              strokeWidth="0.1"
                            />
                          </g>
                        );
                      })}

                      {/* Hover line and point */}
                      {hoverData && (
                        <g>
                          {/* Vertical line */}
                          <line
                            x1={hoverData.x}
                            y1="0"
                            x2={hoverData.x}
                            y2="100"
                            stroke="rgb(var(--primary))"
                            strokeWidth="0.2"
                            strokeDasharray="1,1"
                            opacity="0.8"
                          />
                          {/* Hover point */}
                          <circle
                            cx={hoverData.x}
                            cy={hoverData.y}
                            r="0.8"
                            fill="rgb(var(--primary))"
                            stroke="white"
                            strokeWidth="0.2"
                          />
                        </g>
                      )}
                    </svg>

                    {/* Hover tooltip */}
                    {hoverData && (
                      <div 
                        className="absolute bg-popover border border-border rounded-lg shadow-lg p-3 pointer-events-none z-10"
                        style={{
                          left: `${hoverData.x}%`,
                          top: `${hoverData.y * 3}px`,
                          transform: 'translate(-50%, -100%)',
                          marginTop: '-10px'
                        }}
                      >
                        <div className="text-sm font-medium">${hoverData.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{hoverData.time}</div>
                        <div className="text-xs text-muted-foreground">{hoverData.bidder}</div>
                      </div>                    )}
                  </div>
                  
                  {/* Enhanced Chart labels */}
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00</span>
                    <span>15:00</span>
                  </div>
                  
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-2">
                    <span>${todayHigh.toFixed(0)}</span>
                    <span>${(todayHigh - (todayHigh - todayLow) * 0.25).toFixed(0)}</span>
                    <span>${((todayHigh + todayLow) / 2).toFixed(0)}</span>
                    <span>${(todayLow + (todayHigh - todayLow) * 0.25).toFixed(0)}</span>
                    <span>${todayLow.toFixed(0)}</span>
                  </div>
                  
                  {/* Chart statistics overlay */}
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>24h Change: +{priceChangePercent.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Volume: {mockBidHistory.length} bids</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Avg: ${(mockBidHistory.reduce((sum, bid) => sum + bid.price, 0) / mockBidHistory.length).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bids */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Bidding Activity
                </CardTitle>
                <CardDescription>
                  Latest bids from participants
                </CardDescription>
              </CardHeader>              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {mockBidHistory.slice(-10).reverse().map((bid, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{bid.bidder}</p>
                          <p className="text-sm text-muted-foreground">{bid.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${bid.price.toFixed(2)}</p>
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">
                            Current High
                          </Badge>
                        )}
                        {index < 3 && index > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Recent
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>            {/* Enhanced Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Market Insights & Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Price Momentum
                      </span>
                      <Badge variant="default" className="bg-green-500">Strong Upward</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        Activity Level
                      </span>
                      <Badge variant="outline" className="border-blue-500 text-blue-500">Very High</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-purple-500" />
                        Interest Level
                      </span>
                      <Badge variant="outline" className="border-purple-500 text-purple-500">Extremely High</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <h4 className="font-semibold mb-2">Bid Distribution</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Morning (8-12): </span>
                          <span className="font-bold">{mockBidHistory.filter(b => parseInt(b.time.split(':')[0]) < 12).length} bids</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Afternoon (12-15): </span>
                          <span className="font-bold">{mockBidHistory.filter(b => parseInt(b.time.split(':')[0]) >= 12).length} bids</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg. Bid Interval: </span>
                          <span className="font-bold">15 min</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <h4 className="font-semibold mb-2">Price Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Volatility: </span>
                          <span className="font-bold text-yellow-500">Moderate</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Support Level: </span>
                          <span className="font-bold text-green-500">${(todayLow + 5).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resistance: </span>
                          <span className="font-bold text-red-500">${(todayHigh + 3).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionAnalyticsModal;
