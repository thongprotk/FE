import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReview } from "@/hooks/useReview";
import { ReviewHeader } from "./components/ReviewHeader";
import { Flashcard } from "./components/Flashcard";
import { ReviewControls } from "./components/ReviewControls";
import { ReviewCompletion } from "./components/ReviewCompletion";

export default function ReviewMode() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    deckId,
    cards,
    deck,
    currentIndex,
    isEditing,
    editedFront,
    setEditedFront,
    editedBack,
    setEditedBack,
    editedNote,
    setEditedNote,
    reviewedCards,
    isFlipped,
    setIsFlipped,
    loading,
    saving,
    currentCard,
    progress,
    acceptedCount,
    rejectedCount,
    handleEdit,
    handleSaveEdit,
    handleAccept,
    handleReject,
    handleSkip,
    nextCard,
    previousCard,
    restartReview,
    isReviewComplete,
    setIsEditing,
  } = useReview();

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

  if (cards.length === 0 && !loading) {
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
              <Button variant="link" onClick={restartReview}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCard && !isReviewComplete) {
    return (
      <div className="container mx-auto max-w-4xl py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading card...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <ReviewHeader
        deck={deck}
        currentIndex={currentIndex}
        totalCards={cards.length}
        progress={progress}
        acceptedCount={acceptedCount}
        rejectedCount={rejectedCount}
      />

      {!isReviewComplete && currentCard && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Card {currentIndex + 1} of {cards.length}
            <span className="ml-2">
              • Status:{" "}
              <Badge
                variant="outline"
              >
                {currentCard.status}
              </Badge>
            </span>
          </div>

          <Flashcard
            card={currentCard}
            isFlipped={isFlipped}
            isEditing={isEditing}
            editedFront={editedFront}
            setEditedFront={setEditedFront}
            editedBack={editedBack}
            setEditedBack={setEditedBack}
            editedNote={editedNote}
            setEditedNote={setEditedNote}
            saving={saving}
            onFlip={() => setIsFlipped(!isFlipped)}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
            reviewedStatus={reviewedCards[currentCard.id]}
          />

          <ReviewControls
            saving={saving}
            isEditing={isEditing}
            onReject={handleReject}
            onEdit={handleEdit}
            onSkip={handleSkip}
            onAccept={handleAccept}
          />

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
        </>
      )}

      {isReviewComplete && (
        <ReviewCompletion
          totalCards={cards.length}
          acceptedCount={acceptedCount}
          rejectedCount={rejectedCount}
          onRestart={restartReview}
        />
      )}
    </div>
  );
}
