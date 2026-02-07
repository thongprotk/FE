import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import type { Deck } from "@/types/api";

interface ReviewHeaderProps {
  deck: Deck | null;
  currentIndex: number;
  totalCards: number;
  progress: number;
  acceptedCount: number;
  rejectedCount: number;
}

export const ReviewHeader = ({
  deck,
  currentIndex,
  totalCards,
  progress,
  acceptedCount,
  rejectedCount,
}: ReviewHeaderProps) => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold">Review Cards</h1>
          <p className="text-muted-foreground">
            {deck?.title || "Flashcard Deck"}
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {currentIndex + 1} / {totalCards}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="text-green-600">✓ {acceptedCount} accepted</span>
          <span className="text-red-600">✗ {rejectedCount} rejected</span>
        </div>
      </div>
    </div>
  );
};
