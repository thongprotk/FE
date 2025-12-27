import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { deckService } from "@/services/deck.service";
import { cardService } from "@/services/card.service";
import type { Deck, Card, CreateDeckDto } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card as UICard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  BookOpen,
  ChevronRight,
  Edit2,
  Trash2,
  Play,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function DecksPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [newDeckData, setNewDeckData] = useState<CreateDeckDto>({
    title: "",
    description: "",
    isPublic: false,
  });
  const [editDeckData, setEditDeckData] = useState<CreateDeckDto>({
    title: "",
    description: "",
    isPublic: false,
  });
  const [savingDeck, setSavingDeck] = useState(false);
  const [deletingDeck, setDeletingDeck] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      loadDecks();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const response = await deckService.getAll({ limit: 10, offset: 0 });
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
      setCards([]);
    }
  };

  const handleSelectDeck = async (deck: Deck) => {
    setSelectedDeck(deck);
    await loadCards(deck.id);
  };

  const handleCreateDeck = async () => {
    try {
      if (!newDeckData.title.trim()) {
        toast.error("Please enter a deck title");
        return;
      }

      setSavingDeck(true);
      const createdDeck = await deckService.create(newDeckData);
      setDecks([createdDeck, ...decks]);
      setNewDeckData({ title: "", description: "", isPublic: false });
      setIsCreateDialogOpen(false);
      toast.success("Deck created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create deck");
    } finally {
      setSavingDeck(false);
    }
  };

  const handleEditDeck = async () => {
    if (!selectedDeck) return;

    try {
      if (!editDeckData.title.trim()) {
        toast.error("Please enter a deck title");
        return;
      }

      setSavingDeck(true);
      const updatedDeck = await deckService.update(
        selectedDeck.id,
        editDeckData
      );
      setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
      setSelectedDeck(updatedDeck);
      setIsEditDialogOpen(false);
      toast.success("Deck updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update deck");
    } finally {
      setSavingDeck(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!selectedDeck) return;

    try {
      setDeletingDeck(true);
      await deckService.delete(selectedDeck.id);
      setDecks(decks.filter((d) => d.id !== selectedDeck.id));
      setSelectedDeck(null);
      setCards([]);
      setIsDeleteAlertOpen(false);
      toast.success("Deck deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete deck");
    } finally {
      setDeletingDeck(false);
    }
  };

  const handleStartReview = (deckId: string) => {
    navigate(`/review?deckId=${deckId}`);
  };

  const openEditDialog = () => {
    if (selectedDeck) {
      setEditDeckData({
        title: selectedDeck.title,
        description: selectedDeck.description || "",
        isPublic: selectedDeck.isPublic,
      });
      setIsEditDialogOpen(true);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading account...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Please login to view your decks
        </h1>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading decks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Decks</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || "User"}! You have {decks.length}{" "}
            deck{decks.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Deck
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deck</DialogTitle>
              <DialogDescription>
                Add a new flashcard deck to start learning
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Title *
                </label>
                <Input
                  placeholder="Enter deck title"
                  value={newDeckData.title}
                  onChange={(e) =>
                    setNewDeckData({ ...newDeckData, title: e.target.value })
                  }
                  disabled={savingDeck}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Description
                </label>
                <Textarea
                  placeholder="Enter deck description"
                  value={newDeckData.description || ""}
                  onChange={(e) =>
                    setNewDeckData({
                      ...newDeckData,
                      description: e.target.value,
                    })
                  }
                  disabled={savingDeck}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newDeckData.isPublic || false}
                  onChange={(e) =>
                    setNewDeckData({
                      ...newDeckData,
                      isPublic: e.target.checked,
                    })
                  }
                  disabled={savingDeck}
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium cursor-pointer"
                >
                  Make this deck public
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={savingDeck}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateDeck} disabled={savingDeck}>
                {savingDeck && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Deck
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {decks.length > 0 ? (
          decks.map((deck) => (
            <UICard
              key={deck.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSelectDeck(deck)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <BookOpen className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{deck.title}</CardTitle>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                {deck.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {deck.description}
                  </p>
                )}
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">
                    {deck.cardCount || 0} cards
                  </span>
                  <span className="text-orange-600 font-medium">
                    {deck.dueCardCount || 0} due
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {deck.isPublic ? "🌐 Public" : "🔒 Private"}
                </div>
              </CardContent>
            </UICard>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No decks yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Deck
            </Button>
          </div>
        )}
      </div>

      {selectedDeck && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedDeck.title}</h2>
              {selectedDeck.description && (
                <p className="text-muted-foreground mt-1">
                  {selectedDeck.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleStartReview(selectedDeck.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-4 w-4" />
                Review ({selectedDeck.dueCardCount || 0})
              </Button>

              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={openEditDialog}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Deck</DialogTitle>
                    <DialogDescription>
                      Update your deck information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Title *
                      </label>
                      <Input
                        placeholder="Enter deck title"
                        value={editDeckData.title}
                        onChange={(e) =>
                          setEditDeckData({
                            ...editDeckData,
                            title: e.target.value,
                          })
                        }
                        disabled={savingDeck}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Description
                      </label>
                      <Textarea
                        placeholder="Enter deck description"
                        value={editDeckData.description || ""}
                        onChange={(e) =>
                          setEditDeckData({
                            ...editDeckData,
                            description: e.target.value,
                          })
                        }
                        disabled={savingDeck}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="editIsPublic"
                        checked={editDeckData.isPublic || false}
                        onChange={(e) =>
                          setEditDeckData({
                            ...editDeckData,
                            isPublic: e.target.checked,
                          })
                        }
                        disabled={savingDeck}
                      />
                      <label
                        htmlFor="editIsPublic"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Make this deck public
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={savingDeck}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleEditDeck} disabled={savingDeck}>
                      {savingDeck && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog
                open={isDeleteAlertOpen}
                onOpenChange={setIsDeleteAlertOpen}
              >
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteAlertOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Deck?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{selectedDeck.title}"?
                      This action cannot be undone and all cards in this deck
                      will be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deletingDeck}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteDeck}
                      disabled={deletingDeck}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deletingDeck && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Cards ({cards.length})</h3>
            {cards.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cards.map((card) => (
                  <UICard
                    key={card.id}
                    className="hover:bg-muted transition-colors"
                  >
                    <CardContent className="py-3">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                            Question
                          </p>
                          <p className="text-sm line-clamp-2">
                            {card.frontContent}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                            Answer
                          </p>
                          <p className="text-sm line-clamp-2">
                            {card.backContent}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-muted rounded">
                          {card.status}
                        </span>
                        <span>Interval: {card.interval} days</span>
                        <span>
                          Next:{" "}
                          {new Date(card.nextReviewDate).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </UICard>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No cards in this deck yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
