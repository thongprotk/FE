import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { formatAnswer, cleanAIResponse } from "@/utils/format-answer";
import type { Card as CardType } from "@/types/api";

interface FlashcardProps {
  card: CardType;
  isFlipped: boolean;
  isEditing: boolean;
  editedFront: string;
  setEditedFront: (value: string) => void;
  editedBack: string;
  setEditedBack: (value: string) => void;
  editedNote: string;
  setEditedNote: (value: string) => void;
  saving: boolean;
  onFlip: () => void;
  onSave: () => void;
  onCancel: () => void;
  reviewedStatus?: "accepted" | "rejected" | "edited";
}

export const Flashcard = ({
  card,
  isFlipped,
  isEditing,
  editedFront,
  setEditedFront,
  editedBack,
  setEditedBack,
  editedNote,
  setEditedNote,
  saving,
  onFlip,
  onSave,
  onCancel,
  reviewedStatus,
}: FlashcardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500";
      case "LEARNING":
        return "bg-yellow-500";
      case "REVIEW":
        return "bg-purple-500";
      case "MASTERED":
        return "bg-green-500";
      case "RELEARNING":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(card.status)}>
              {card.status}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Interval: {card.interval} days
            </Badge>
          </div>
          {reviewedStatus && (
            <Badge
              variant={
                reviewedStatus === "accepted" || reviewedStatus === "edited"
                  ? "default"
                  : "destructive"
              }
            >
              {reviewedStatus === "accepted" || reviewedStatus === "edited"
                ? "✓ Accepted"
                : "✗ Rejected"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Question</label>
              <Textarea
                value={editedFront}
                onChange={(e) => setEditedFront(e.target.value)}
                className="min-h-25"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Answer</label>
              <Textarea
                value={cleanAIResponse(editedBack)}
                onChange={(e) => setEditedBack(e.target.value)}
                className="min-h-30"
                disabled={saving}
                placeholder="Enter answer (use • for bullets, numbered lists for steps)"
              />
              {editedBack && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-700 mb-2">
                    Preview:
                  </p>
                  <div className="space-y-1 text-sm">
                    {formatAnswer(cleanAIResponse(editedBack)).map(
                      (line, idx) => (
                        <div key={idx}>
                          {line.type === "bullet" && (
                            <div className="flex items-start gap-2">
                              <span className="text-green-600 font-bold">
                                •
                              </span>
                              <span>{line.content}</span>
                            </div>
                          )}
                          {line.type === "number" && (
                            <div className="flex items-start gap-2">
                              <span className="text-green-600 font-bold">
                                →
                              </span>
                              <span>{line.content}</span>
                            </div>
                          )}
                          {line.type === "heading" && (
                            <p className="font-semibold text-green-700">
                              {line.content}
                            </p>
                          )}
                          {line.type === "text" && <p>{line.content}</p>}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Note (optional)
              </label>
              <Textarea
                value={editedNote}
                onChange={(e) => setEditedNote(e.target.value)}
                className="min-h-15"
                placeholder="Add notes or additional context..."
                disabled={saving}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save & Accept
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="min-h-75 flex flex-col items-center justify-center cursor-pointer p-8 rounded-lg border border-dashed"
            onClick={onFlip}
          >
            {!isFlipped ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Question
                </p>
                <h2 className="text-2xl font-semibold">{card.frontContent}</h2>
                <p className="text-sm text-muted-foreground">
                  Click to reveal answer
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Answer
                </p>
                <div className="bg-linear-to-r from-green-50 to-transparent p-4 rounded-lg border border-green-100 text-left">
                  <div className="space-y-2">
                    {formatAnswer(cleanAIResponse(card.backContent)).map(
                      (line, idx) => (
                        <div key={idx}>
                          {line.type === "bullet" && (
                            <div className="flex items-start gap-2">
                              <span className="text-green-600 font-bold text-sm mt-0.5">
                                •
                              </span>
                              <span className="text-sm">{line.content}</span>
                            </div>
                          )}
                          {line.type === "number" && (
                            <div className="flex items-start gap-2">
                              <span className="text-green-600 font-bold text-sm">
                                →
                              </span>
                              <span className="text-sm">{line.content}</span>
                            </div>
                          )}
                          {line.type === "heading" && (
                            <p className="font-semibold text-sm text-green-700 mt-2">
                              {line.content}
                            </p>
                          )}
                          {line.type === "text" && (
                            <p className="text-sm">{line.content}</p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
                {card.note && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Note:</p>
                    <p className="text-sm text-gray-600">{card.note}</p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Click to flip back
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
