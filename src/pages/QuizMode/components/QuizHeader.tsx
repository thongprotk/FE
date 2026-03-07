import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import type { Deck } from "@/types/api";

interface QuizHeaderProps {
  deck: Deck | null;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  wrongCount: number;
}

export const QuizHeader = ({
  deck,
  currentIndex,
  totalCards,
  correctCount,
  wrongCount,
}: QuizHeaderProps) => {
  const navigate = useNavigate();
  const progress = totalCards > 0 ? (currentIndex / totalCards) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/decks")}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Quiz</h1>
          <p className="text-muted-foreground">
            {deck?.title || "Flashcard Deck"}
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {currentIndex} / {totalCards}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="text-green-600">✓ {correctCount} correct</span>
          <span className="text-red-600">✗ {wrongCount} wrong</span>
        </div>
      </div>
    </div>
  );
};
