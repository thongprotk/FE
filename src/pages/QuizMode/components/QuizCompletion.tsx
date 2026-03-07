import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";

interface QuizCompletionProps {
  total: number;
  correctCount: number;
  deckId: string;
}

export const QuizCompletion = ({
  total,
  correctCount,
  deckId,
}: QuizCompletionProps) => {
  const navigate = useNavigate();
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const getGrade = () => {
    if (percentage >= 90) return { label: "Xuất sắc! 🎉", color: "text-green-600" };
    if (percentage >= 70) return { label: "Tốt! 👍", color: "text-blue-600" };
    if (percentage >= 50) return { label: "Trung bình 😐", color: "text-yellow-600" };
    return { label: "Cần ôn thêm 📚", color: "text-red-600" };
  };

  const grade = getGrade();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="bg-card border rounded-2xl p-10 shadow-md max-w-md w-full space-y-6">
        <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />

        <div>
          <h2 className="text-3xl font-bold mb-1">Hoàn thành!</h2>
          <p className={`text-xl font-semibold ${grade.color}`}>{grade.label}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted rounded-xl p-4">
            <p className="text-3xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground mt-1">Tổng câu</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4">
            <p className="text-3xl font-bold text-green-600">{correctCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Đúng</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4">
            <p className="text-3xl font-bold text-red-600">{total - correctCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Sai</p>
          </div>
        </div>

        <div className="text-5xl font-black text-primary">{percentage}%</div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/decks")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về Decks
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate(`/quiz?deckId=${deckId}`)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
};
