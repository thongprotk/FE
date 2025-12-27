import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Sparkles,
  BookOpenText,
  Bot,
  User as UserIcon,
} from "lucide-react";
import { resourceService } from "@/services/resource.service";
import useResourceSocket from "@/hooks/useResourceSocket";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function LessonBuilderPage() {
  const [topic, setTopic] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Chào bạn! Nhập chủ đề và dán tài liệu. Mình sẽ gửi lên AI để sinh Lesson + Flashcards và xếp lịch SRS.",
    },
  ]);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastResourceId, setLastResourceId] = useState<string | null>(null);

  const saveResource = async () => {
    setError("");
    setStatusMessage("");

    const trimmedContent = content.trim();
    const trimmedTopic = topic.trim();
    if (!trimmedTopic || !trimmedContent) {
      setError("Nhập chủ đề và nội dung trước khi gửi.");
      return;
    }

    const userMessage = `Chủ đề: ${trimmedTopic}\nLink: ${
      link.trim() || "(không có)"
    }\nNội dung:\n${trimmedContent}`;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setIsSaving(true);
    try {
      const payload = {
        title: trimmedTopic,
        url: link.trim(),
        content: trimmedContent,
      };

      const saved = await resourceService.create(payload);
      setLastResourceId(saved.id);

      const aiResponse =
        "Đã nhận nội dung. AI đang phân tích để sinh Lesson + Flashcards và sẽ đưa vào SRS ngay sau khi hoàn tất.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
      setStatusMessage(
        "Đang xử lý với AI. Kiểm tra Resources/Decks sau vài phút."
      );
      setTopic("");
      setLink("");
      setContent("");
    } catch (err: any) {
      const message =
        err?.message || "Không thể lưu nội dung. Kiểm tra đăng nhập hoặc mạng.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  useResourceSocket((payload) => {
    // Only show updates relevant to the last created resource
    if (lastResourceId && payload.resourceId !== lastResourceId) return;

    const text = payload.aiSummary
      ? `AI tóm tắt:
${payload.aiSummary}`
      : `AI status: ${payload.aiStatus || "UNKNOWN"}`;

    setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    if (payload.aiStatus === "COMPLETED") {
      setStatusMessage("AI đã hoàn tất xử lý. Kiểm tra Resources/Decks.");
    } else if (payload.aiStatus === "FAILED") {
      setStatusMessage("AI xử lý thất bại. Vui lòng thử lại sau.");
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-primary/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-base">
                Lesson & Flashcard Builder
              </h1>
              <p className="text-xs text-muted-foreground">
                Nhập chủ đề + tài liệu → AI sinh Lesson + Flashcards → Đưa vào
                SRS
              </p>
            </div>
          </div>
          <Badge variant="secondary">AI Ready</Badge>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpenText className="h-4 w-4" /> Nhập thông tin bài học
            </CardTitle>
            <CardDescription className="text-xs">
              Chủ đề + tài liệu (bắt buộc), link nguồn (tuỳ chọn). Hãy dán text
              đã làm sạch nếu có thể.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Chủ đề cần học (ví dụ: Dynamic Programming cơ bản)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Input
              placeholder="Link nguồn (tuỳ chọn)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <Textarea
              placeholder="Dán đoạn tài liệu hoặc transcript"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[220px] text-sm"
            />
            <Button
              onClick={saveResource}
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gửi lên AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm">Luồng AI</CardTitle>
            <CardDescription className="text-xs">
              Nhật ký trao đổi với AI (giả lập). Sau khi xử lý, vào
              Resources/Decks để xem kết quả thực tế.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-sm flex gap-2 ${
                  msg.role === "assistant"
                    ? "border-primary/30 bg-primary/5"
                    : "border-muted bg-muted/40"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="h-4 w-4 mt-0.5 text-primary" />
                ) : (
                  <UserIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                )}
                <span className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </span>
              </div>
            ))}
            {isSaving && (
              <div className="p-3 rounded-lg border border-primary/40 bg-primary/5 text-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Đang gửi nội dung tới AI...
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <div className="max-w-5xl mx-auto px-4 pb-6 space-y-2">
        {statusMessage && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <AlertDescription className="text-sm">
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="border-destructive/40 bg-destructive/10">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
