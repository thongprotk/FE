import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Chrome,
  Layout,
  TrendingUp,
  CheckCircle,
  LogIn,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const pages = [
    {
      title: "Login / Register",
      description: "Sign in or create an account to access your flashcards",
      icon: LogIn,
      path: "/login",
      color: "bg-indigo-500",
    },
    {
      title: "My Decks",
      description: "View and manage your flashcard decks",
      icon: BookOpen,
      path: "/decks",
      color: "bg-blue-500",
      requiresAuth: true,
    },
    {
      title: "Landing Page",
      description:
        "Beautiful landing page showcasing AI-powered flashcard features",
      icon: Layout,
      path: "/landing",
      color: "bg-green-500",
    },
    {
      title: "Review Mode",
      description: "Review and approve AI-generated flashcards before studying",
      icon: CheckCircle,
      path: "/review",
      color: "bg-orange-500",
    },
    {
      title: "Heatmap Statistics",
      description:
        "Track your learning progress with beautiful heatmap visualization",
      icon: TrendingUp,
      path: "/heatmap",
      color: "bg-purple-500",
      requiresAuth: true,
    },
    {
      title: "Chrome Extension",
      description:
        "Popup UI for Chrome extension with quick capture and generation",
      icon: Chrome,
      path: "/extension",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">FlashAI Demo</h1>
        <p className="text-xl text-muted-foreground">
          AI-Powered Flashcard Learning Platform
        </p>
        {isAuthenticated && (
          <p className="text-sm text-green-600 mt-2">✓ You are logged in</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {pages.map((page) => {
          const Icon = page.icon;
          const isDisabled = page.requiresAuth && !isAuthenticated;

          return (
            <Card
              key={page.path}
              className={`hover:shadow-lg transition-shadow ${
                isDisabled ? "opacity-50" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${page.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{page.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {page.description}
                  {isDisabled && (
                    <span className="block text-xs text-orange-600 mt-1">
                      Requires login
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => navigate(page.path)}
                  disabled={isDisabled}
                >
                  View Demo →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto bg-linear-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle>Features Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-left space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>
                  <strong>Full Backend Integration:</strong> Connected to NestJS
                  API with auth, decks, cards, and analytics
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>
                  <strong>Authentication:</strong> JWT-based login/register with
                  protected routes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>
                  <strong>Deck Management:</strong> Create, view, and manage
                  flashcard decks
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>
                  <strong>Analytics:</strong> Real-time learning statistics and
                  heatmap visualization
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <span>
                  <strong>Review Mode:</strong> Interactive card review system
                  with SM-2 algorithm
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
