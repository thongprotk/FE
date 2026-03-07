import { cn } from "@/lib/utils";
import type { QuizItem } from "@/types/api";

type OptionState = "idle" | "correct" | "wrong";

interface QuizQuestionProps {
  quizItem: QuizItem;
  selectedOption: string | null;
  onSelect: (option: string) => void;
}

export const QuizQuestion = ({
  quizItem,
  selectedOption,
  onSelect,
}: QuizQuestionProps) => {
  const { card, options } = quizItem;
  const hasSelected = selectedOption !== null;

  const getOptionState = (option: string): OptionState => {
    if (!hasSelected) return "idle";
    if (option === card.backContent) return "correct";
    if (option === selectedOption) return "wrong";
    return "idle";
  };

  return (
    <div className="bg-card border rounded-2xl p-8 shadow-md space-y-6">
      {/* Question */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Question
        </p>
        <h2 className="text-xl font-semibold leading-relaxed">
          {card.frontContent}
        </h2>
        {card.note && (
          <p className="mt-2 text-sm text-muted-foreground italic">{card.note}</p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((option, idx) => {
          const state = getOptionState(option);
          return (
            <button
              key={idx}
              disabled={hasSelected}
              onClick={() => onSelect(option)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                state === "idle" &&
                  !hasSelected &&
                  "border-border hover:border-primary hover:bg-primary/5 cursor-pointer",
                state === "idle" &&
                  hasSelected &&
                  "border-border text-muted-foreground cursor-not-allowed opacity-60",
                state === "correct" &&
                  "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400",
                state === "wrong" &&
                  "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
              )}
            >
              <span className="inline-flex items-center gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full border text-xs flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="whitespace-pre-wrap">{option}</span>
                {state === "correct" && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
                {state === "wrong" && (
                  <span className="ml-auto text-red-600">✗</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {hasSelected && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Chuyển câu tiếp theo...
        </p>
      )}
    </div>
  );
};
