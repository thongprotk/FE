import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Flame,
  TrendingUp,
  Award,
  Zap,
  Target,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { analyticsService } from "@/services/analytics.service";
import { deckService } from "@/services/deck.service";
import type { LearningOverview, Deck } from "@/types/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function HeatmapPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [heatmapData, setHeatmapData] = useState<{ [key: string]: number }>({});
  const [overview, setOverview] = useState<LearningOverview | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [avgDaily, setAvgDaily] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const overviewData = await analyticsService.getOverview();
      setOverview(overviewData);

      // Load decks for deck-by-deck stats
      const decksData = await deckService.getAll({ limit: 100 });
      setDecks(decksData.items);

      const heatmapMap: { [key: string]: number } = {};
      overviewData.recentActivity.forEach((item) => {
        heatmapMap[item.date] = item.reviewed;
      });
      setHeatmapData(heatmapMap);

      // Calculate streak
      calculateStreak(overviewData);

      // Calculate average daily cards
      const totalReviewed = overviewData.recentActivity.reduce(
        (sum, item) => sum + item.reviewed,
        0
      );
      const avgCards =
        overviewData.recentActivity.length > 0
          ? Math.round(totalReviewed / overviewData.recentActivity.length)
          : 0;
      setAvgDaily(avgCards);
    } catch (error: any) {
      toast.error(error.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (data: LearningOverview) => {
    let currentStreak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const activity = data.recentActivity.find((a) => a.date === dateStr);
      if (activity && activity.reviewed > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const getActivityColor = (level: number) => {
    const colors = [
      "bg-muted",
      "bg-green-200",
      "bg-green-300",
      "bg-green-400",
      "bg-green-500",
      "bg-green-600",
    ];
    const normalizedLevel = Math.min(5, Math.floor(level / 5));
    return colors[normalizedLevel] || colors[0];
  };

  const getMonthsArray = () => {
    const months: { name: string; weeks: Date[][] }[] = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = monthDate.toLocaleString("en-US", { month: "short" });

      const weeks: Date[][] = [];
      let currentWeek: Date[] = [];

      const firstDay = new Date(monthDate);
      const lastDay = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      // Fill initial empty days
      const startDayOfWeek = firstDay.getDay();
      for (let j = 0; j < startDayOfWeek; j++) {
        currentWeek.push(new Date(0)); // placeholder
      }

      // Fill actual days
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth(),
          day
        );
        currentWeek.push(date);

        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }

      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }

      months.push({ name: monthName, weeks });
    }

    return months;
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Please login to view your statistics
        </h1>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  if (loading || !overview) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading statistics...</p>
      </div>
    );
  }

  const masteryPercentage =
    overview.totalCards > 0
      ? Math.round((overview.masteredCards / overview.totalCards) * 100)
      : 0;
  const learningPercentage =
    overview.totalCards > 0
      ? Math.round((overview.learningCards / overview.totalCards) * 100)
      : 0;
  const newPercentage =
    overview.totalCards > 0
      ? Math.round((overview.newCards / overview.totalCards) * 100)
      : 0;

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Statistics</h1>
        <p className="text-muted-foreground">
          Track your learning progress and maintain your study streak
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.totalCards}</div>
            <p className="text-xs text-muted-foreground">cards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Due Cards</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.dueCards}</div>
            <p className="text-xs text-muted-foreground">to review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Mastered</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.masteredCards}</div>
            <p className="text-xs text-muted-foreground">
              {masteryPercentage}% of cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Daily Avg</CardTitle>
              <Zap className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgDaily}</div>
            <p className="text-xs text-muted-foreground">cards/day</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Study Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streak}</div>
            <p className="text-xs text-muted-foreground">consecutive days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.totalDecks}</div>
            <p className="text-xs text-muted-foreground">active decks</p>
          </CardContent>
        </Card>
      </div>

      {/* Card Status Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Card Status Breakdown</CardTitle>
          <CardDescription>
            Distribution of your cards by learning status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Mastered</span>
              <span className="font-medium">
                {overview.masteredCards} ({masteryPercentage}%)
              </span>
            </div>
            <Progress value={masteryPercentage} className="h-2 bg-green-100" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Learning</span>
              <span className="font-medium">
                {overview.learningCards} ({learningPercentage}%)
              </span>
            </div>
            <Progress
              value={learningPercentage}
              className="h-2 bg-yellow-100"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>New</span>
              <span className="font-medium">
                {overview.newCards} ({newPercentage}%)
              </span>
            </div>
            <Progress value={newPercentage} className="h-2 bg-blue-100" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="heatmap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heatmap">
            <Calendar className="h-4 w-4 mr-2" />
            Heatmap
          </TabsTrigger>
          <TabsTrigger value="weekly">
            <TrendingUp className="h-4 w-4 mr-2" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="decks">
            <Award className="h-4 w-4 mr-2" />
            Decks
          </TabsTrigger>
        </TabsList>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
              <CardDescription>
                Your learning activity over the past 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Less</span>
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-4 h-4 rounded ${getActivityColor(
                        level
                      )} border`}
                    />
                  ))}
                  <span className="text-muted-foreground">More</span>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto">
                  <div className="inline-flex flex-col gap-1">
                    {getMonthsArray().map((month, monthIdx) => (
                      <div key={monthIdx} className="flex gap-1 items-center">
                        <div className="w-12 text-xs text-muted-foreground">
                          {month.name}
                        </div>
                        <div className="flex flex-col gap-1">
                          {month.weeks.map((week, weekIdx) => (
                            <div key={weekIdx} className="flex gap-1">
                              {week.map((date, dayIdx) => {
                                const dateStr = date
                                  .toISOString()
                                  .split("T")[0];
                                const activity =
                                  date.getTime() > 0
                                    ? heatmapData[dateStr] || 0
                                    : 0;
                                const isPlaceholder = date.getTime() === 0;

                                return (
                                  <div
                                    key={dayIdx}
                                    className={`w-3 h-3 rounded-sm border ${
                                      isPlaceholder
                                        ? "bg-transparent border-transparent"
                                        : `${getActivityColor(
                                            activity
                                          )} cursor-pointer hover:ring-2 hover:ring-primary`
                                    } transition-all`}
                                    onClick={() =>
                                      !isPlaceholder && setSelectedDate(dateStr)
                                    }
                                    title={
                                      !isPlaceholder
                                        ? `${dateStr}: ${activity} cards`
                                        : ""
                                    }
                                  />
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>{selectedDate}</strong>:{" "}
                      {heatmapData[selectedDate]} cards studied
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your learning activity over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview.recentActivity.slice(0, 30).map((activity) => (
                  <div key={activity.date} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-40">
                        {new Date(activity.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex-1 mx-4">
                        <Progress
                          value={
                            (activity.reviewed /
                              Math.max(overview.dueCards, 60)) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                      <span className="text-muted-foreground text-right text-xs w-32">
                        {activity.reviewed} reviewed
                        {activity.mastered > 0 && ` • ${activity.mastered} ✓`}
                      </span>
                    </div>
                  </div>
                ))}
                {overview.recentActivity.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity. Start studying to see your progress
                    here!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decks Tab */}
        <TabsContent value="decks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Decks Performance</CardTitle>
              <CardDescription>
                Statistics for each of your flashcard decks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decks.length > 0 ? (
                  decks.map((deck) => (
                    <div
                      key={deck.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{deck.title}</h3>
                          {deck.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {deck.description}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/review?deckId=${deck.id}`)}
                        >
                          Review
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Cards</p>
                          <p className="font-medium">{deck.cardCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due</p>
                          <p className="font-medium text-orange-600">
                            {deck.dueCardCount || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Public</p>
                          <p className="font-medium">
                            {deck.isPublic ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium text-xs">
                            {new Date(deck.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No decks yet. Create one to start learning!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
