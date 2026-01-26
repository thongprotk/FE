import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { deckService } from "@/services/deck.service";
import { cardService } from "@/services/card.service";
import { formatAnswer, cleanAIResponse } from "@/utils/format-answer";
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
  CalendarCheck,
  BicepsFlexed,
  CalendarSync,
  TriangleAlert,
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
  const [editDeckData, setEditDeckData] = useState<CreateDeckDto>({});
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
      if (!newDeckData?.title?.trim()) {
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
      if (!editDeckData?.title?.trim()) {
        toast.error("Please enter a deck title");
        return;
      }

      setSavingDeck(true);
      const updatedDeck = await deckService.update(
        selectedDeck.id,
        editDeckData,
      );
      console.log("Updated Deck:", updatedDeck);
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
                  className="w-full max-w-full break-all resize-y min-h-25"
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
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setNewDeckData({
                    title: "",
                    description: "",
                    isPublic: false,
                  });
                }}
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

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className={selectedDeck ? "w-full lg:w-5/12 xl:w-1/2" : "w-full"}>
          {selectedDeck && (
            <div className="mb-4">
              <Button variant="outline" onClick={() => setSelectedDeck(null)}>
                ← Back to Decks
              </Button>
            </div>
          )}
          <div
            className={
              selectedDeck
                ? "grid grid-cols-1 gap-4 max-h-125 overflow-y-auto"
                : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            }
          >
            {decks.length > 0 ? (
              decks.map((deck) => (
                <UICard
                  key={deck.id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer rounded-xl border bg-white ${selectedDeck?.id === deck.id ? "border-primary border-2" : "border-muted"}`}
                  onClick={() => handleSelectDeck(deck)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between h-full gap-2">
                      <div className="flex items-center gap-3 flex-1 max-w-md min-w-0">
                        <BookOpen className="h-5 w-5 text-primary opacity-50" />
                        <div className="flex-1 min-w-0">
                          <CardTitle
                            className="text-lg font-semibold text-primary line-clamp-2 leading-snug"
                            title={deck.title}
                          >
                            {deck.title}
                          </CardTitle>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    {deck.description && (
                      <p
                        className="text-sm text-muted-foreground mb-2 line-clamp-2"
                        title={deck.description}
                      >
                        {deck.description}
                      </p>
                    )}
                    <div className="flex justify-between text-sm mb-2">
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
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No decks yet</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Deck
                </Button>
              </div>
            )}
          </div>
        </div>

        {selectedDeck && (
          <div className="w-full lg:w-7/12 xl:w-2/3">
            <div className="mt-0">
              <div className="flex items-center mb-6">
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
                        <DialogTitle>Edit Deck </DialogTitle>
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
                              setEditDeckData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
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
                              setEditDeckData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            disabled={savingDeck}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="editIsPublic"
                            checked={editDeckData.isPublic || false}
                            onChange={(e) =>
                              setEditDeckData((prev) => ({
                                ...prev,
                                isPublic: e.target.checked,
                              }))
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
                          Are you sure you want to delete "{selectedDeck.title}
                          "? This action cannot be undone and all cards in this
                          deck will be deleted.
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

              <div className="bg-muted/50 rounded-xl p-6 border border-muted">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    Flashcards
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({cards.length} {cards.length === 1 ? "card" : "cards"})
                    </span>
                  </h3>
                </div>

                {cards.length > 0 ? (
                  <div className="space-y-2 max-h-125 overflow-y-auto pr-2">
                    {cards.map((card) => {
                      const statusColors = {
                        NEW: "bg-blue-100 text-blue-700 border-blue-200",
                        LEARNING:
                          "bg-yellow-100 text-yellow-700 border-yellow-200",
                        REVIEW:
                          "bg-purple-100 text-purple-700 border-purple-200",
                        MASTERED:
                          "bg-green-100 text-green-700 border-green-200",
                        RELEARNING:
                          "bg-orange-100 text-orange-700 border-orange-200",
                      };

                      const statusColor =
                        statusColors[card.status] ||
                        "bg-gray-100 text-gray-700 border-gray-200";
                      const isOverdue =
                        new Date(card.nextReviewDate) < new Date();

                      return (
                        <UICard
                          key={card.id}
                          className="hover:shadow-md transition-all border-l-4 border-l-primary/20 hover:border-l-primary rounded-lg bg-white border"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="bg-linear-to-r from-blue-50 to-transparent p-3 rounded-md border border-blue-100">
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-600 font-semibold text-xs mt-0.5">
                                    Q:
                                  </span>
                                  <p
                                    className="text-sm font-medium"
                                    title={card.frontContent}
                                  >
                                    {card.frontContent}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-linear-to-r from-green-50 to-transparent p-3 rounded-md border border-green-100">
                                <div className="flex items-start gap-2">
                                  <span className="text-green-600 font-semibold text-xs mt-0.5">
                                    A:
                                  </span>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    {formatAnswer(
                                      cleanAIResponse(card.backContent),
                                    ).map((line, idx) => (
                                      <div key={idx}>
                                        {line.type === "bullet" && (
                                          <div className="flex items-start gap-2">
                                            <span className="text-green-600 font-bold text-xs mt-0.5">
                                              •
                                            </span>
                                            <span>{line.content}</span>
                                          </div>
                                        )}
                                        {line.type === "number" && (
                                          <div className="flex items-start gap-2">
                                            <span className="text-green-600 font-bold text-xs">
                                              →
                                            </span>
                                            <span>{line.content}</span>
                                          </div>
                                        )}
                                        {line.type === "heading" && (
                                          <p className="font-semibold text-xs text-green-700 mt-2">
                                            {line.content}
                                          </p>
                                        )}
                                        {line.type === "text" && (
                                          <p>{line.content}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {card.note && (
                                <div className="bg-amber-50 p-2 rounded border border-amber-200">
                                  <div className="text-xs text-amber-800 italic space-y-1">
                                    {formatAnswer(
                                      cleanAIResponse(card.note),
                                    ).map((line, idx) => (
                                      <div key={idx}>
                                        {line.type === "bullet" && (
                                          <div className="flex items-start gap-2">
                                            <span className="text-amber-700 font-bold text-xs mt-0.5">
                                              •
                                            </span>
                                            <span>{line.content}</span>
                                          </div>
                                        )}
                                        {line.type === "number" && (
                                          <div className="flex items-start gap-2">
                                            <span className="text-amber-700 font-bold text-xs">
                                              →
                                            </span>
                                            <span>{line.content}</span>
                                          </div>
                                        )}
                                        {line.type === "heading" && (
                                          <p className="font-semibold text-xs text-amber-700 mt-2">
                                            {line.content}
                                          </p>
                                        )}
                                        {line.type === "text" && (
                                          <p>{line.content}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                                  >
                                    {card.status}
                                  </span>

                                  <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded">
                                    <CalendarCheck size={12} />
                                    <span>{card.interval}d</span>
                                  </span>

                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded flex items-center gap-1">
                                    <BicepsFlexed size={12} /> EF:{" "}
                                    {card.easinessFactor.toFixed(1)}
                                  </span>

                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded flex items-center gap-1">
                                    <CalendarSync size={12} /> {card.repetition}
                                    x
                                  </span>
                                </div>
                                <div
                                  className={`text-xs font-medium flex items-center gap-1 ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}
                                >
                                  {isOverdue ? (
                                    <div className="flex items-center gap-1">
                                      <TriangleAlert color="red" size={12} />{" "}
                                      Overdue
                                    </div>
                                  ) : (
                                    "📌"
                                  )}{" "}
                                  {new Date(
                                    card.nextReviewDate,
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </UICard>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
                    <p className="text-muted-foreground mb-2">
                      No cards in this deck yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Add cards to start learning
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
