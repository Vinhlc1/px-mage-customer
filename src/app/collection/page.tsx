"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { storySeries, getSeriesProgress } from "@/data/storySeries";
import { cards } from "@/data/cards";
import { useCollection } from "@/contexts/CollectionContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BookOpen,
  Award,
  Star,
  CheckCircle,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Collection = () => {
  const {
    collection,
    addCardToCollection,
    removeCardFromCollection,
    markSeriesCompleted,
    hasCard,
    hasPurchased,
    isSeriesCompleted,
  } = useCollection();
  const { toast } = useToast();
  const [assembledStory, setAssembledStory] = useState<string | null>(null);
  const [currentSeries, setCurrentSeries] = useState<string | null>(null);
  const [openMovies, setOpenMovies] = useState<Record<string, boolean>>({});
  const [showVideo, setShowVideo] = useState<{ [key: string]: boolean }>({});
  const handleToggleCard = (cardId: string) => {
    // Kiểm tra user đã mua thẻ chưa
    if (!hasPurchased(cardId)) {
      toast({
        title: "⚠️ Chưa thể đánh dấu",
        description:
          "Bạn chưa sưu tầm thẻ này! Hãy mua thẻ trước khi đánh dấu vào bộ sưu tập.",
        variant: "destructive",
      });
      return;
    }

    if (hasCard(cardId)) {
      removeCardFromCollection(cardId);
      toast({
        title: "Đã bỏ đánh dấu",
        description: "Thẻ đã được loại khỏi bộ sưu tập",
      });
    } else {
      addCardToCollection(cardId);
      toast({
        title: "✅ Đã đánh dấu",
        description: "Thẻ đã được thêm vào bộ sưu tập!",
      });
    }
  };

  const handleCompleteSeries = (seriesId: string) => {
    const series = storySeries.find((s) => s.id === seriesId);
    if (!series) return;
    const progress = getSeriesProgress(seriesId, collection.collectedCards);
    if (!progress.isComplete) {
      toast({
        title: "⚠️ Chưa đủ thẻ",
        description: `Bạn cần sưu tầm đủ ${progress.total} thẻ của chương này để hoàn thành câu chuyện!`,
        variant: "destructive",
      });
      return;
    }
    setAssembledStory(series.completedStory);
    setCurrentSeries(seriesId);
    if (!isSeriesCompleted(seriesId)) {
      markSeriesCompleted(seriesId);
      toast({
        title: "🎉 Chúc mừng!",
        description: `Bạn đã hoàn thành ${series.name}! Nhận được: ${series.rewards?.badge}`,
      });
    }
  };
  const handleViewCompletedStory = (seriesId: string) => {
    const series = storySeries.find((s) => s.id === seriesId);
    if (!series) return;

    setAssembledStory(series.completedStory);
    setCurrentSeries(seriesId);
  };

  const toggleMovie = (seriesId: string) => {
    setOpenMovies((prev) => ({
      ...prev,
      [seriesId]: !prev[seriesId],
    }));
  };
  // Temporary function for demo - add some purchased cards
  const addDemoCards = () => {
    // Simulate purchasing some cards for demo
    ["odin-wisdom", "loki-cunning", "thor-strength", "freya-beauty"].forEach(
      (cardId) => {
        addCardToCollection(cardId);
      }
    );
    toast({
      title: "🎮 Demo Cards Added!",
      description: "Đã thêm một số thẻ mẫu cho demo",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />

      <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-4 text-gradient-gold">
            Bộ Sưu Tập Của Tôi
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
            Theo dõi các thẻ bài, hoàn thành các chương truyện và mở khóa những
            câu chuyện huyền thoại
          </p>
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span>{collection.collectedCards.length} thẻ đã sưu tầm</span>
            </div>{" "}
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>
                {collection.completedSeries.length} chương đã hoàn thành
              </span>
            </div>
            <Button onClick={addDemoCards} size="sm" variant="outline">
              🎮 Demo: Thêm thẻ mẫu
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          {storySeries.map((series) => {
            const progress = getSeriesProgress(
              series.id,
              collection.collectedCards
            );
            const completed = isSeriesCompleted(series.id);
            const progressPercentage =
              (progress.collected / progress.total) * 100;

            return (
              <Card
                key={series.id}
                className="overflow-hidden constellation-pattern border-2"
              >
                <CardHeader className="bg-linear-to-r from-primary/10 to-secondary/10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl md:text-3xl font-serif text-gradient-gold">
                        {series.name}
                      </CardTitle>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-2">
                        {series.description}
                      </p>
                      <p className="text-xs sm:text-sm text-primary mt-1">
                        Thần thoại: {series.mythology}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={completed ? "default" : "secondary"}
                          className="text-xs sm:text-sm"
                        >
                          {progress.collected}/{progress.total} thẻ
                        </Badge>
                        {completed && (
                          <Badge className="bg-green-600 text-white text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Hoàn thành</span>
                            <span className="sm:hidden">Done</span>
                          </Badge>
                        )}
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="w-24 sm:w-32 h-2"
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                    {series.cards.map((cardId) => {
                      const card = cards.find((c) => c.id === cardId);
                      if (!card) return null;
                      const owned = hasCard(cardId);

                      return (
                        <div
                          key={cardId}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                            owned
                              ? "border-primary bg-primary/5 shadow-lg"
                              : hasPurchased(cardId)
                              ? "border-border bg-background/50 hover:border-primary/50"
                              : "border-red-500/50 bg-red-500/5"
                          }`}
                        >
                          <div className="aspect-2/3 mb-3 overflow-hidden rounded-lg relative">
                            <Image
                              src={card.image}
                              alt={card.name}
                              fill
                              className={`object-cover transition-all duration-300 ${
                                owned
                                  ? "scale-105"
                                  : "grayscale hover:grayscale-0"
                              }`}
                            />
                          </div>

                          <div className="text-center">
                            <h3 className="font-bold text-sm mb-1">
                              {card.name}
                            </h3>
                            <Badge className="text-xs mb-3">
                              {card.rarity}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleToggleCard(cardId)}
                              className={
                                owned ? "bg-green-600 hover:bg-green-700" : ""
                              }
                              disabled={!hasPurchased(cardId)}
                            >
                              {owned ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Đã có
                                </>
                              ) : hasPurchased(cardId) ? (
                                "Đánh dấu"
                              ) : (
                                "🔒 Chưa mua"
                              )}
                            </Button>
                          </div>

                          {owned && (
                            <div className="absolute top-2 right-2">
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>{" "}
                  <div className="text-center pt-4 border-t border-border">
                    {completed ? (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            onClick={() => handleViewCompletedStory(series.id)}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <BookOpen className="w-5 h-5 mr-2" />
                            📖 Đọc lại câu chuyện
                          </Button>

                          <Button
                            onClick={() => toggleMovie(series.id)}
                            size="lg"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            🎬 Xem Phim
                            {openMovies[series.id] ? (
                              <ChevronUp className="w-4 h-4 ml-2" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-2" />
                            )}
                          </Button>
                        </div>

                        <Collapsible open={openMovies[series.id]}>
                          <CollapsibleContent className="mt-4">
                            <div className="bg-black/20 rounded-lg p-6 border border-purple-500/30">
                              <h3 className="text-xl font-bold mb-4 text-center text-purple-300">
                                🎬 Phim: {series.name}
                              </h3>
                              <div className="aspect-video bg-linear-to-br from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden mb-4 border border-purple-500/20">
                                {showVideo[series.id] ? (
                                  <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/sWqo6-FFD58?autoplay=1"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                      <Play className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                                      <p className="text-lg font-semibold">
                                        Trailer - {series.name}
                                      </p>
                                      <p className="text-sm mt-2">
                                        Đây là video trailer của chương truyện
                                      </p>
                                      <Button
                                        className="mt-4 bg-purple-600 hover:bg-purple-700"
                                        onClick={() =>
                                          setShowVideo((prev) => ({
                                            ...prev,
                                            [series.id]: true,
                                          }))
                                        }
                                      >
                                        ▶️ Phát Video
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground text-center">
                                <p className="mb-2">
                                  📝 <strong>Mô tả phim:</strong>{" "}
                                  {series.description}
                                </p>
                                <p>
                                  🎭 <strong>Thần thoại:</strong>{" "}
                                  {series.mythology}
                                </p>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>

                        <p className="text-sm text-green-400">
                          ✅ Chương đã hoàn thành! Bạn có thể đọc lại và xem
                          phim bất cứ lúc nào
                        </p>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleCompleteSeries(series.id)}
                          disabled={!progress.isComplete}
                          size="lg"
                          className={`${
                            progress.isComplete
                              ? "bg-primary hover:bg-primary/90 animate-pulse-glow"
                              : ""
                          }`}
                        >
                          <BookOpen className="w-5 h-5 mr-2" />
                          Hoàn thành câu chuyện
                        </Button>

                        {progress.isComplete && (
                          <p className="text-sm text-primary mt-2 animate-pulse">
                            ✨ Bạn đã sưu tầm đủ thẻ! Nhấn để ghép thành câu
                            chuyện hoàn chỉnh
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Assembled Story Modal */}
        {assembledStory && currentSeries && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
              <Card className="max-w-4xl mx-auto constellation-pattern border-primary">
                <CardHeader className="bg-linear-to-r from-primary/20 to-secondary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-serif text-gradient-gold">
                        📖{" "}
                        {storySeries.find((s) => s.id === currentSeries)?.name}
                      </CardTitle>
                      <p className="text-muted-foreground mt-2">
                        Câu chuyện hoàn chỉnh
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setAssembledStory(null);
                        setCurrentSeries(null);
                      }}
                      variant="outline"
                    >
                      Đóng
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="prose prose-invert prose-lg max-w-none">
                    {assembledStory.split("\n\n").map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="mb-4 leading-relaxed text-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-8 p-6 rounded-lg bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/30">
                    <h3 className="text-xl font-bold mb-2 text-primary">
                      🏆 Phần thưởng:{" "}
                      {
                        storySeries.find((s) => s.id === currentSeries)?.rewards
                          ?.title
                      }
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {
                        storySeries.find((s) => s.id === currentSeries)?.rewards
                          ?.description
                      }
                    </p>
                    <Badge className="text-sm">
                      {
                        storySeries.find((s) => s.id === currentSeries)?.rewards
                          ?.badge
                      }
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Collection;
