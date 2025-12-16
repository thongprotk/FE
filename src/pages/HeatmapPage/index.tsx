import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Flame, TrendingUp, Award, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data - trong thực tế sẽ fetch từ API
const generateMockHeatmapData = () => {
    const data: { [key: string]: number } = {}
    const today = new Date()

    // Generate data for last 365 days
    for (let i = 0; i < 365; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        // Random activity level (0-5)
        data[dateStr] = Math.floor(Math.random() * 6)
    }

    return data
}

const mockStats = {
    currentStreak: 7,
    longestStreak: 45,
    totalDays: 180,
    cardsStudied: 2450,
    hoursSpent: 87.5,
    averageAccuracy: 92
}

const mockWeeklyData = [
    { day: 'Mon', cards: 35, minutes: 25 },
    { day: 'Tue', cards: 42, minutes: 32 },
    { day: 'Wed', cards: 28, minutes: 18 },
    { day: 'Thu', cards: 51, minutes: 38 },
    { day: 'Fri', cards: 45, minutes: 35 },
    { day: 'Sat', cards: 38, minutes: 28 },
    { day: 'Sun', cards: 30, minutes: 22 },
]

const mockMonthlyGoals = {
    cardsTarget: 500,
    cardsCompleted: 342,
    daysTarget: 25,
    daysCompleted: 18,
    hoursTarget: 20,
    hoursCompleted: 14.5
}

export default function HeatmapPage() {
    const [heatmapData] = useState(generateMockHeatmapData())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    const getActivityColor = (level: number) => {
        const colors = [
            'bg-muted',           // 0 - no activity
            'bg-green-200',       // 1 - very low
            'bg-green-300',       // 2 - low
            'bg-green-400',       // 3 - medium
            'bg-green-500',       // 4 - high
            'bg-green-600',       // 5 - very high
        ]
        return colors[level] || colors[0]
    }

    const getMonthsArray = () => {
        const months: { name: string, weeks: Date[][] }[] = []
        const today = new Date()

        for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
            const monthName = monthDate.toLocaleString('en-US', { month: 'short' })

            const weeks: Date[][] = []
            let currentWeek: Date[] = []

            const firstDay = new Date(monthDate)
            const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)

            // Fill initial empty days
            const startDayOfWeek = firstDay.getDay()
            for (let j = 0; j < startDayOfWeek; j++) {
                currentWeek.push(new Date(0)) // placeholder
            }

            // Fill actual days
            for (let day = 1; day <= lastDay.getDate(); day++) {
                const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
                currentWeek.push(date)

                if (currentWeek.length === 7) {
                    weeks.push(currentWeek)
                    currentWeek = []
                }
            }

            if (currentWeek.length > 0) {
                weeks.push(currentWeek)
            }

            months.push({ name: monthName, weeks })
        }

        return months
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
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                            <Flame className="h-4 w-4 text-orange-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockStats.currentStreak}</div>
                        <p className="text-xs text-muted-foreground">days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                            <Award className="h-4 w-4 text-yellow-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockStats.longestStreak}</div>
                        <p className="text-xs text-muted-foreground">days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Cards Studied</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockStats.cardsStudied}</div>
                        <p className="text-xs text-muted-foreground">total</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                            <Clock className="h-4 w-4 text-purple-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mockStats.hoursSpent}</div>
                        <p className="text-xs text-muted-foreground">hours</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="heatmap" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="heatmap">
                        <Calendar className="h-4 w-4 mr-2" />
                        Heatmap
                    </TabsTrigger>
                    <TabsTrigger value="weekly">Weekly Stats</TabsTrigger>
                    <TabsTrigger value="goals">Monthly Goals</TabsTrigger>
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
                                    {[0, 1, 2, 3, 4, 5].map(level => (
                                        <div
                                            key={level}
                                            className={`w-4 h-4 rounded ${getActivityColor(level)} border`}
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
                                                                const dateStr = date.toISOString().split('T')[0]
                                                                const activity = date.getTime() > 0 ? (heatmapData[dateStr] || 0) : 0
                                                                const isPlaceholder = date.getTime() === 0

                                                                return (
                                                                    <div
                                                                        key={dayIdx}
                                                                        className={`w-3 h-3 rounded-sm border ${
                                                                            isPlaceholder 
                                                                                ? 'bg-transparent border-transparent' 
                                                                                : `${getActivityColor(activity)} cursor-pointer hover:ring-2 hover:ring-primary`
                                                                        } transition-all`}
                                                                        onClick={() => !isPlaceholder && setSelectedDate(dateStr)}
                                                                        title={!isPlaceholder ? `${dateStr}: ${activity} cards` : ''}
                                                                    />
                                                                )
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
                                            <strong>{selectedDate}</strong>: {heatmapData[selectedDate]} cards studied
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Weekly Stats Tab */}
                <TabsContent value="weekly" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>This Week's Activity</CardTitle>
                            <CardDescription>
                                Daily breakdown of your study sessions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockWeeklyData.map((day) => (
                                    <div key={day.day} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium w-12">{day.day}</span>
                                            <div className="flex-1 mx-4">
                                                <Progress value={(day.cards / 60) * 100} className="h-2" />
                                            </div>
                                            <span className="text-muted-foreground w-24 text-right">
                                                {day.cards} cards • {day.minutes}m
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Average Daily Cards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {Math.round(mockWeeklyData.reduce((sum, d) => sum + d.cards, 0) / 7)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    cards per day this week
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Average Study Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {Math.round(mockWeeklyData.reduce((sum, d) => sum + d.minutes, 0) / 7)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    minutes per day this week
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Monthly Goals Tab */}
                <TabsContent value="goals" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Goals</CardTitle>
                            <CardDescription>
                                Track your progress towards this month's targets
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Cards Studied</span>
                                    <span className="text-muted-foreground">
                                        {mockMonthlyGoals.cardsCompleted} / {mockMonthlyGoals.cardsTarget}
                                    </span>
                                </div>
                                <Progress
                                    value={(mockMonthlyGoals.cardsCompleted / mockMonthlyGoals.cardsTarget) * 100}
                                    className="h-3"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Active Days</span>
                                    <span className="text-muted-foreground">
                                        {mockMonthlyGoals.daysCompleted} / {mockMonthlyGoals.daysTarget}
                                    </span>
                                </div>
                                <Progress
                                    value={(mockMonthlyGoals.daysCompleted / mockMonthlyGoals.daysTarget) * 100}
                                    className="h-3"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Study Hours</span>
                                    <span className="text-muted-foreground">
                                        {mockMonthlyGoals.hoursCompleted} / {mockMonthlyGoals.hoursTarget}
                                    </span>
                                </div>
                                <Progress
                                    value={(mockMonthlyGoals.hoursCompleted / mockMonthlyGoals.hoursTarget) * 100}
                                    className="h-3"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">On Track 🎯</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    You're doing great! Keep up the momentum.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Achievement 🏆</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    68% to monthly goal completion
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Next Milestone 🚀</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    158 cards to reach your goal
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

