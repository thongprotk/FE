import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Chrome, Layout, TrendingUp, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function HomePage(){
    const navigate = useNavigate()

    const pages = [
        {
            title: "Landing Page",
            description: "Beautiful landing page showcasing AI-powered flashcard features",
            icon: Layout,
            path: "/landing",
            color: "bg-blue-500"
        },
        {
            title: "Review Mode",
            description: "Review and approve AI-generated flashcards before studying",
            icon: CheckCircle,
            path: "/review",
            color: "bg-green-500"
        },
        {
            title: "Heatmap Statistics",
            description: "Track your learning progress with beautiful heatmap visualization",
            icon: TrendingUp,
            path: "/heatmap",
            color: "bg-purple-500"
        },
        {
            title: "Chrome Extension",
            description: "Popup UI for Chrome extension with quick capture and generation",
            icon: Chrome,
            path: "/extension",
            color: "bg-orange-500"
        }
    ]

    return(
        <div className="container mx-auto max-w-6xl py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">FlashAI Demo</h1>
                <p className="text-xl text-muted-foreground">
                    AI-Powered Flashcard Learning Platform
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {pages.map((page) => {
                    const Icon = page.icon
                    return (
                        <Card key={page.path} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`${page.color} p-3 rounded-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle>{page.title}</CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    {page.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full"
                                    onClick={() => navigate(page.path)}
                                >
                                    View Demo →
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="mt-12 text-center">
                <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardHeader>
                        <CardTitle>Features Implemented</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-left space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                <span><strong>Landing Page:</strong> Complete marketing page with features, stats, and CTA</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                <span><strong>Review Mode:</strong> Interactive card review system with accept/reject/edit functionality</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                <span><strong>Heatmap:</strong> Learning statistics with GitHub-style heatmap and progress tracking</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                <span><strong>Chrome Extension:</strong> Complete popup UI with capture, generation, and settings</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}