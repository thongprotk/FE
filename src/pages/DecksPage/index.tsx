import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { deckService } from "@/services/deck.service";
import { cardService } from "@/services/card.service";
import type { Deck, Card } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card as UICard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, BookOpen, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function DecksPage() {
  const { user, isAuthenticated } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDecks();
    }
  }, [isAuthenticated]);

  const loadDecks = async () => {
    try {
      const response = await deckService.getAll({ limit: 50, offset: 0 });
      setDecks(response.items);
    } catch (error: any) {
      toast.error(error.message || "Failed to load decks");
    } finally {
      setLoading(false);
    }
  };

  const loadCards = async (deckId: string) => {
    try {
      const response = await cardService.getAll(deckId, { limit: 100 });
      setCards(response.items);
    } catch (error: any) {
      toast.error(error.message || "Failed to load cards");
    }
  };

  const handleCreateDeck = async () => {
    try {
      const newDeck = await deckService.create({
        title: "New Deck",
        description: "A new flashcard deck",
        isPublic: false,
      });
      setDecks([newDeck, ...decks]);
      toast.success("Deck created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create deck");
    }
  };

  const handleSelectDeck = async (deck: Deck) => {
    setSelectedDeck(deck);
    await loadCards(deck.id);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Please login to view your decks
        </h1>
        <Button onClick={() => (window.location.href = "/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Loading decks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Decks</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}!
          </p>
        </div>
        <Button onClick={handleCreateDeck}>
          <Plus className="mr-2 h-4 w-4" />
          New Deck
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <UICard
            key={deck.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleSelectDeck(deck)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>{deck.title}</CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {deck.description}
              </p>
              <div className="flex justify-between text-sm">
                <span>{deck.cardCount || 0} cards</span>
                <span className="text-orange-600">
                  {deck.dueCardCount || 0} due
                </span>
              </div>
            </CardContent>
          </UICard>
        ))}
      </div>

      {selectedDeck && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Cards in "{selectedDeck.title}"
          </h2>
          <div className="space-y-2">
            {cards.map((card) => (
              <UICard key={card.id}>
                <CardContent className="py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Front
                      </p>
                      <p>{card.frontContent}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Back
                      </p>
                      <p>{card.backContent}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Status: {card.status}</span>
                    <span>
                      Next review:{" "}
                      {new Date(card.nextReviewDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </UICard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
