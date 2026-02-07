import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cardService } from "@/services/card.service";
import { deckService } from "@/services/deck.service";
import type { Card as CardType, Deck } from "@/types/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useReview = () => {
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

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);

      if (deckId) {
        const deckData = await deckService.getById(deckId);
        setDeck(deckData);

        const dueCards = await cardService.getDueCards(deckId);
        setCards(dueCards);
      } else {
        toast.error("No deck selected");
        navigate("/decks");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load cards");
      navigate("/decks");
    } finally {
      setLoading(false);
    }
  }, [deckId, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/review");
      return;
    }

    loadCards();
  }, [isAuthenticated, loadCards, navigate]);

  const currentCard = cards[currentIndex];
  const progress =
    (Object.keys(reviewedCards).length / Math.max(cards.length, 1)) * 100;
  const acceptedCount = Object.values(reviewedCards).filter(
    (v) => v === "accepted" || v === "edited",
  ).length;
  const rejectedCount = Object.values(reviewedCards).filter(
    (v) => v === "rejected",
  ).length;

  const handleEdit = () => {
    if (!currentCard) return;
    setEditedFront(currentCard.frontContent);
    setEditedBack(currentCard.backContent);
    setEditedNote(currentCard.note || "");
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      if (!deckId || !currentCard) return;

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
            : c,
        ),
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
      if (!deckId || !currentCard) return;

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
      if (!deckId || !currentCard) return;

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

  const nextCard = () => {
    setIsFlipped(false);
    setIsEditing(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Mark as complete
      setCurrentIndex(cards.length);
    }
  };

  const previousCard = () => {
    setIsFlipped(false);
    setIsEditing(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    nextCard();
  };

  const restartReview = () => {
    setCurrentIndex(0);
    setReviewedCards({});
    setIsFlipped(false);
    setIsEditing(false);
    loadCards();
  };

  return {
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
    loadCards,
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
    isReviewComplete: currentIndex >= cards.length && cards.length > 0,
    setIsEditing,
  };
};
