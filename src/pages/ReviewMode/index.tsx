import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Edit2,
  SkipForward,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { cardService } from "@/services/card.service";
import { deckService } from "@/services/deck.service";
import type { Card as CardType, Deck } from "@/types/api";
import { toast } from "sonner";

export default function ReviewMode() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const deckId = searchParams.get("deckId");

  const [cards, setCards] = useState<CardType[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFront, setEditedFront] = useState("");
  const [editedBack, setEditedBack] = useState("");
  const [editedNote, setEditedNote] = useState("");
  const [reviewedCards, setReviewedCards] = useState<{
    [key: string]: "accepted" | "rejected" | "edited";
  }>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/review");
      return;
    }

    loadCards();
  }, [isAuthenticated, deckId]);

  const loadCards = async () => {
    try {
      setLoading(true);

      // Get due cards dari API
      if (deckId) {
        const deckData = await deckService.getById(deckId);
        setDeck(deckData);

        const cardsData = await cardService.getAll(deckId, { limit: 100 });
        const dueCards = cardsData.items.filter(
          (card) =>
            card.status === "NEW" ||
            card.status === "LEARNING" ||
            card.status === "RELEARNING"
        );
        setCards(dueCards);
      } else {
        // Fallback: show all cards
        toast.error("No deck selected");
        navigate("/decks");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load cards");
      navigate("/decks");
    } finally {
      setLoading(false);
    }
  };

  const currentCard = cards[currentIndex];
  const progress =
    (Object.keys(reviewedCards).length / Math.max(cards.length, 1)) * 100;
  const acceptedCount = Object.values(reviewedCards).filter(
    (v) => v === "accepted" || v === "edited"
  ).length;
  const rejectedCount = Object.values(reviewedCards).filter(
    (v) => v === "rejected"
  ).length;

  const handleEdit = () => {
    setEditedFront(currentCard.frontContent);
    setEditedBack(currentCard.backContent);
    setEditedNote(currentCard.note || "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      if (!deckId) return;

      await cardService.update(deckId, currentCard.id, {
        frontContent: editedFront,
        backContent: editedBack,
        note: editedNote,
      });

      setReviewedCards((prev) => ({ ...prev, [currentCard.id]: "edited" }));
      setCards((prev) =>
        prev.map((c) =>
          c.id === currentCard.id
            ? {
                ...c,
                frontContent: editedFront,
                backContent: editedBack,
                note: editedNote,
              }
            : c
        )
      );
      setIsEditing(false);
      toast.success("Card updated successfully");
      nextCard();
    } catch (error: any) {
      toast.error(error.message || "Failed to update card");
    } finally {
      setSaving(false);
    }
  };

  const handleAccept = async () => {
    try {
      setSaving(true);
      if (!deckId) return;

      // Send review with quality 5 (perfect answer)
      await cardService.review(deckId, currentCard.id, { quality: 5 });

      setReviewedCards((prev) => ({ ...prev, [currentCard.id]: "accepted" }));
      toast.success("Card accepted");
      nextCard();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept card");
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    try {
      setSaving(true);
      if (!deckId) return;

      // Send review with quality 0 (complete blackout)
      await cardService.review(deckId, currentCard.id, { quality: 0 });

      setReviewedCards((prev) => ({ ...prev, [currentCard.id]: "rejected" }));
      toast.success("Card rejected");
      nextCard();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject card");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    setIsEditing(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const previousCard = () => {
    setIsFlipped(false);
    setIsEditing(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Please login to review cards
        </h1>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading cards...</p>
      </div>
    );
  }

  if (!deckId) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No deck selected</h1>
          <p className="text-muted-foreground mb-6">
            Please select a deck to review cards
          </p>
          <Button onClick={() => navigate("/decks")}>Go to Decks</Button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <Card className="text-center p-12">
          <CardHeader>
            <CardTitle className="text-2xl">No cards to review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              All cards in this deck have been mastered or there are no cards
              yet.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate("/decks")}>Go to Decks</Button>
              <Button variant="link" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      {/* Header */}
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
            {currentIndex + 1} / {cards.length}
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

      {/* Current Index Display */}
      <div className="mb-4 text-sm text-muted-foreground">
        Card {currentIndex + 1} of {cards.length}
        {currentCard && (
          <span className="ml-2">
            • Status:{" "}
            <Badge
              variant="outline"
              className={getStatusColor(currentCard.status)}
            >
              {currentCard.status}
            </Badge>
          </span>
        )}
      </div>

      {/* Flashcard */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentCard.status}</Badge>
              <Badge variant="secondary" className="text-xs">
                Interval: {currentCard.interval} days
              </Badge>
            </div>
            {reviewedCards[currentCard.id] && (
              <Badge
                variant={
                  reviewedCards[currentCard.id] === "accepted" ||
                  reviewedCards[currentCard.id] === "edited"
                    ? "default"
                    : "destructive"
                }
              >
                {reviewedCards[currentCard.id] === "accepted" ||
                reviewedCards[currentCard.id] === "edited"
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
                <label className="text-sm font-medium mb-2 block">
                  Question
                </label>
                <Textarea
                  value={editedFront}
                  onChange={(e) => setEditedFront(e.target.value)}
                  className="min-h-[100px]"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Answer</label>
                <Textarea
                  value={editedBack}
                  onChange={(e) => setEditedBack(e.target.value)}
                  className="min-h-[120px]"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Note (optional)
                </label>
                <Textarea
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="min-h-[60px]"
                  placeholder="Add notes or additional context..."
                  disabled={saving}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save & Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="min-h-[300px] flex flex-col items-center justify-center cursor-pointer p-8 rounded-lg border border-dashed"
              onClick={() => !saving && setIsFlipped(!isFlipped)}
            >
              {!isFlipped ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    Question
                  </p>
                  <h2 className="text-2xl font-semibold">
                    {currentCard.frontContent}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Click to reveal answer
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    Answer
                  </p>
                  <p className="text-xl">{currentCard.backContent}</p>
                  {currentCard.note && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        Note:
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentCard.note}
                      </p>
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

      {/* Info Alert */}
      {!isEditing && (
        <Alert className="mb-6">
          <AlertDescription>
            💡 <strong>Tips:</strong> Click the card to flip. You can edit the
            card to improve it, then it will be accepted automatically.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      {!isEditing && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleReject}
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <XCircle className="mr-2 h-5 w-5" />
            )}
            Reject
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleEdit}
            disabled={saving}
            className="w-full"
          >
            <Edit2 className="mr-2 h-5 w-5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleSkip}
            disabled={saving}
            className="w-full"
          >
            <SkipForward className="mr-2 h-5 w-5" />
            Skip
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={handleAccept}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5" />
            )}
            Accept
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="ghost"
          onClick={previousCard}
          disabled={currentIndex === 0 || saving}
        >
          ← Previous
        </Button>
        <Button
          variant="ghost"
          onClick={nextCard}
          disabled={currentIndex === cards.length - 1 || saving}
        >
          Next →
        </Button>
      </div>

      {/* Completion Screen */}
      {currentIndex >= cards.length && (
        <Card className="text-center p-12 mt-8">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">🎉 Review Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold">{cards.length}</div>
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
              <Button variant="link" onClick={() => window.location.reload()}>
                Review Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
