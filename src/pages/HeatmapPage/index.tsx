import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Flame, TrendingUp, Award, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { analyticsService } from "@/services/analytics.service";
import type { LearningOverview } from "@/types/api";
import { toast } from "sonner";

export default function HeatmapPage() {
  const { isAuthenticated } = useAuth();
  const [heatmapData, setHeatmapData] = useState<{ [key: string]: number }>({});
  const [overview, setOverview] = useState<LearningOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    try {
      const overviewData = await analyticsService.getOverview();
      setOverview(overviewData);

      const heatmapMap: { [key: string]: number } = {};
      overviewData.recentActivity.forEach((item) => {
        heatmapMap[item.date] = item.reviewed;
      });
      setHeatmapData(heatmapMap);
    } catch (error: any) {
      toast.error(error.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
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
      </div>
    );
  }

  if (loading || !overview) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Loading statistics...</p>
      </div>
    );
  }

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
            <p className="text-xs text-muted-foreground">cards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.totalDecks}</div>
            <p className="text-xs text-muted-foreground">decks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="heatmap" className="space-y-6">
        <TabsList>
          <TabsTrigger value="heatmap">
            <Calendar className="h-4 w-4 mr-2" />
            Heatmap
          </TabsTrigger>
          <TabsTrigger value="weekly">Recent Activity</TabsTrigger>
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
                Your learning activity over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview.recentActivity.slice(0, 7).map((activity) => (
                  <div key={activity.date} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-32">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <div className="flex-1 mx-4">
                        <Progress
                          value={(activity.reviewed / 60) * 100}
                          className="h-2"
                        />
                      </div>
                      <span className="text-muted-foreground text-right">
                        {activity.reviewed} reviewed • {activity.mastered}{" "}
                        mastered
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
      </Tabs>
    </div>
  );
}
