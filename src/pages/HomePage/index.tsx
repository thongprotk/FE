import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full">
      <section className="container mx-auto max-w-6xl py-20 px-4 text-center">
        <div className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Personalized Learning System
        </div>
        <div className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A comprehensive AI-powered flashcard learning platform with
          intelligent spaced repetition, advanced analytics, and beautiful
          visualization.
        </div>
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
      </section>
    </div>
  );
}
