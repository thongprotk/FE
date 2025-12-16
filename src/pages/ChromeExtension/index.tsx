import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Sparkles,
    BookOpen,
    Settings,
    TrendingUp,
    Plus,
    Check,
    Loader2,
    Flame,
    Clock
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ChromeExtensionPopup() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedText, setSelectedText] = useState("")
    const [generatedCards, setGeneratedCards] = useState<number>(0)
    const [autoCapture, setAutoCapture] = useState(true)
    const [todayStats] = useState({
        cardsCreated: 12,
        streak: 7,
        minutesStudied: 28
    })

    const handleGenerateCards = async () => {
        setIsGenerating(true)
        // Simulate API call
        setTimeout(() => {
            setGeneratedCards(5)
            setIsGenerating(false)
        }, 2000)
    }

    const handleQuickCapture = () => {
        // Simulate capturing selected text from current page
        setSelectedText("React is a JavaScript library for building user interfaces...")
    }

    return (
        <div className="w-[380px] h-[600px] bg-background">
            <Tabs defaultValue="generate" className="h-full flex flex-col">
                {/* Header */}
                <div className="border-b px-4 py-3 bg-primary/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="font-bold text-sm">FlashAI</h1>
                                <p className="text-xs text-muted-foreground">Smart Flashcards</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {todayStats.streak}
                        </Badge>
                    </div>
                </div>

                <TabsList className="w-full rounded-none border-b">
                    <TabsTrigger value="generate" className="flex-1">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="flex-1">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Stats
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                {/* Generate Tab */}
                <TabsContent value="generate" className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2">
                        <Card className="bg-muted/50">
                            <CardContent className="p-3 text-center">
                                <div className="text-xl font-bold">{todayStats.cardsCreated}</div>
                                <div className="text-xs text-muted-foreground">Today</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                            <CardContent className="p-3 text-center">
                                <div className="text-xl font-bold text-orange-600">{todayStats.streak}</div>
                                <div className="text-xs text-muted-foreground">Streak</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                            <CardContent className="p-3 text-center">
                                <div className="text-xl font-bold">{todayStats.minutesStudied}</div>
                                <div className="text-xs text-muted-foreground">Minutes</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Capture */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Quick Capture</CardTitle>
                            <CardDescription className="text-xs">
                                Select text on any page and click to capture
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleQuickCapture}
                                variant="outline"
                                className="w-full"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Capture Selected Text
                            </Button>

                            {selectedText && (
                                <Alert>
                                    <AlertDescription className="text-xs">
                                        ✓ Text captured! Ready to generate cards.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Manual Input */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Manual Input</CardTitle>
                            <CardDescription className="text-xs">
                                Paste or type content to create flashcards
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea
                                placeholder="Paste your content here..."
                                value={selectedText}
                                onChange={(e) => setSelectedText(e.target.value)}
                                className="min-h-[100px] text-sm"
                            />
                            <Button
                                onClick={handleGenerateCards}
                                disabled={!selectedText || isGenerating}
                                className="w-full"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Generate Flashcards
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Success Message */}
                    {generatedCards > 0 && (
                        <Alert className="border-green-500/50 bg-green-500/10">
                            <Check className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-sm">
                                <strong>Success!</strong> Generated {generatedCards} flashcards.
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-xs ml-1"
                                    onClick={() => window.open('/review', '_blank')}
                                >
                                    Review now →
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Quick Actions */}
                    <Separator />
                    <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                            <BookOpen className="h-4 w-4 mr-2" />
                            View All Decks
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Study Now
                        </Button>
                    </div>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="flex-1 overflow-y-auto p-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Today's Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Cards Created</span>
                                </div>
                                <span className="text-lg font-bold">{todayStats.cardsCreated}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Study Time</span>
                                </div>
                                <span className="text-lg font-bold">{todayStats.minutesStudied}m</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Flame className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm">Current Streak</span>
                                </div>
                                <span className="text-lg font-bold">{todayStats.streak} days</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">This Week</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Total Cards</span>
                                    <span className="font-semibold">78</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Study Sessions</span>
                                    <span className="font-semibold">14</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Accuracy</span>
                                    <span className="font-semibold text-green-600">92%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open('/heatmap', '_blank')}
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Full Statistics
                    </Button>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="flex-1 overflow-y-auto p-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Auto-Capture</CardTitle>
                            <CardDescription className="text-xs">
                                Automatically detect and suggest content for flashcards
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="auto-capture" className="text-sm">
                                    Enable Auto-Capture
                                </Label>
                                <Switch
                                    id="auto-capture"
                                    checked={autoCapture}
                                    onCheckedChange={setAutoCapture}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Generation Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cards-count" className="text-xs">
                                    Cards per generation
                                </Label>
                                <Input
                                    id="cards-count"
                                    type="number"
                                    defaultValue="5"
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="auto-review" className="text-sm">
                                    Auto-open review
                                </Label>
                                <Switch id="auto-review" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                                Sync Now
                            </Button>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="text-center text-xs text-muted-foreground">
                        Version 1.0.0
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

