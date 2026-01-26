import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  CheckCircle,
  BookOpen,
  Flame,
  Zap,
  Shield,
  RefreshCw,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const pages = [
    {
      title: "My Decks",
      description:
        "Create, manage, and organize your flashcard decks with full CRUD",
      icon: BookOpen,
      path: "/decks",
      color: "bg-blue-500",
      requiresAuth: true,
      badge: "New CRUD UI",
    },
    {
      title: "Review Cards",
      description:
        "Review and study cards with SM-2 spaced repetition algorithm",
      icon: CheckCircle,
      path: "/review",
      color: "bg-orange-500",
      requiresAuth: true,
      badge: "With API",
    },
    {
      title: "Learning Statistics",
      description:
        "Track progress with heatmap, streaks, and detailed analytics",
      icon: TrendingUp,
      path: "/heatmap",
      color: "bg-purple-500",
      requiresAuth: true,
      badge: "Enhanced",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Intelligent flashcard generation with AI assistance",
      color: "text-yellow-600",
    },
    {
      icon: RefreshCw,
      title: "SM-2 Algorithm",
      description: "Spaced repetition for optimal learning retention",
      color: "text-blue-600",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time statistics, streaks, and performance tracking",
      color: "text-green-600",
    },
    {
      icon: Shield,
      title: "Secure Auth",
      description: "JWT-based authentication with Google OAuth support",
      color: "text-red-600",
    },
    {
      icon: Smartphone,
      title: "Lesson Builder",
      description: "Nhập chủ đề + tài liệu, AI sinh Lesson & Flashcards",
      color: "text-purple-600",
    },
    {
      icon: Flame,
      title: "Study Streaks",
      description: "Maintain your learning momentum with daily streaks",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="w-full">
      <section className="container mx-auto max-w-6xl py-20 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Personalized Learning System (SRS + GenAI)
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A comprehensive AI-powered flashcard learning platform with
          intelligent spaced repetition, advanced analytics, and beautiful
          visualization.
        </p>
        {isAuthenticated ? (
          <div className="flex gap-4 justify-center mb-8">
            <Button size="lg" onClick={() => navigate("/decks")}>
              My Decks →
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/heatmap")}
            >
              Analytics
            </Button>
          </div>
        ) : (
          <Button size="lg" onClick={() => navigate("/login")} className="mb-8">
            Get Started →
          </Button>
        )}
        <p className="text-sm text-muted-foreground">
          {isAuthenticated && (
            <span className="text-green-600 font-medium">
              ✓ You are logged in
            </span>
          )}
        </p>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto max-w-6xl py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className={`h-8 w-8 ${feature.color} mb-2`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto max-w-6xl py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Explore Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
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
                  <div className="flex items-start gap-4">
                    <div className={`${page.color} p-3 rounded-lg shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                        {page.badge && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {page.badge}
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {page.description}
                        {isDisabled && (
                          <span className="block text-xs text-orange-600 mt-1">
                            Requires login
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => navigate(page.path)}
                    disabled={isDisabled}
                  >
                    {page.title === "My Decks"
                      ? "Manage Decks →"
                      : page.title === "Review Cards"
                        ? "Start Review →"
                        : page.title === "Learning Statistics"
                          ? "View Analytics →"
                          : "View Demo →"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto max-w-4xl py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Create your first deck, add flashcards, and start your learning
          journey with smart spaced repetition.
        </p>
        {isAuthenticated ? (
          <Button size="lg" onClick={() => navigate("/decks")}>
            Go to My Decks
          </Button>
        ) : (
          <Button size="lg" onClick={() => navigate("/login")}>
            Create Your Account
          </Button>
        )}
      </section>
    </div>
  );
}
