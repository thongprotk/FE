import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cardService } from "@/services/card.service";
import { deckService } from "@/services/deck.service";
import type { QuizItem, Deck } from "@/types/api";
import { QuizHeader } from "./components/QuizHeader";
import { QuizQuestion } from "./components/QuizQuestion";
import { QuizCompletion } from "./components/QuizCompletion";
import { CARDS_REVIEWED_EVENT } from "@/hooks/useDueCards";

export default function QuizMode() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get("deckId");

  const [deck, setDeck] = useState<Deck | null>(null);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const autoNextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadQuiz = useCallback(async () => {
    if (!deckId) {
      navigate("/decks");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [deckData, items] = await Promise.all([
        deckService.getById(deckId),
        cardService.getQuizCards(deckId),
      ]);
      setDeck(deckData);

      if (items.length === 0) {
        setError("Deck này chưa có đủ thẻ để tạo quiz (cần ít nhất 2 thẻ).");
        return;
      }

      // Shuffle quiz order
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setQuizItems(shuffled);
      setCurrentIndex(0);
      setSelectedOption(null);
      setCorrectCount(0);
      setWrongCount(0);
      setIsComplete(false);
    } catch {
      setError("Không thể tải quiz. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [deckId, navigate]);

  useEffect(() => {
    loadQuiz();
    return () => {
      if (autoNextTimer.current) clearTimeout(autoNextTimer.current);
    };
  }, [loadQuiz]);

  const handleSelect = useCallback(
    (option: string) => {
      if (selectedOption !== null) return;

      const current = quizItems[currentIndex];
      const isCorrect = option === current.card.backContent;

      setSelectedOption(option);
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        setWrongCount((c) => c + 1);
      }

      // Feed result into SM-2: correct = grade 4, wrong = grade 1
      cardService
        .review(deckId!, current.card.id, { grade: isCorrect ? 4 : 1 })
        .then(() => window.dispatchEvent(new Event(CARDS_REVIEWED_EVENT)))
        .catch(() => {/* silent fail — quiz UX không bị gián đoạn */});

      // Clear previous timer trước khi set mới (tránh race condition)
      if (autoNextTimer.current) clearTimeout(autoNextTimer.current);

      autoNextTimer.current = setTimeout(() => {
        setSelectedOption(null);
        const next = currentIndex + 1;
        if (next >= quizItems.length) {
          setIsComplete(true);
        } else {
          setCurrentIndex(next);
        }
      }, 2000);
    },
    [selectedOption, quizItems, currentIndex, deckId],
  );

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập để làm quiz</h1>
        <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Đang tải quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center space-y-4">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" onClick={() => navigate("/decks")}>
          Về trang Decks
        </Button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <QuizCompletion
          total={quizItems.length}
          correctCount={correctCount}
          deckId={deckId!}
        />
      </div>
    );
  }

  const currentItem = quizItems[currentIndex];

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <QuizHeader
        deck={deck}
        currentIndex={currentIndex}
        totalCards={quizItems.length}
        correctCount={correctCount}
        wrongCount={wrongCount}
      />
      <QuizQuestion
        quizItem={currentItem}
        selectedOption={selectedOption}
        onSelect={handleSelect}
      />
    </div>
  );
}
