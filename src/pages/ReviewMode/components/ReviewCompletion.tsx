import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewCompletionProps {
  totalCards: number;
  acceptedCount: number;
  rejectedCount: number;
  onRestart: () => void;
}

export const ReviewCompletion = ({
  totalCards,
  acceptedCount,
  rejectedCount,
  onRestart,
}: ReviewCompletionProps) => {
  const navigate = useNavigate();

  return (
    <Card className="text-center p-12 mt-8">
      <CardHeader>
        <CardTitle className="text-3xl mb-4">🎉 Review Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-3xl font-bold">{totalCards}</div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {acceptedCount}
            </div>
            <div className="text-sm text-muted-foreground">Accepted</div>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="text-3xl font-bold text-red-600">
              {rejectedCount}
            </div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
        </div>
        <div className="space-y-2">
          <Button size="lg" onClick={() => navigate("/decks")}>
            Back to Decks
          </Button>
          <Button variant="link" onClick={onRestart}>
            Review Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
