import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, BarChart3, CheckCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const navigate = useNavigate();
  const handClickLogin = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-linear-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              🎓 Personalized Learning System
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Personalized Learning System (SRS + GenAI)
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nền tảng học tập cá nhân hóa: thu thập tri thức, sinh flashcard tự
              động và ôn tập tối ưu với SM-2.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 cursor-pointer"
              onClick={handClickLogin}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to master any subject
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Generated Cards</CardTitle>
                <CardDescription>
                  Create flashcards instantly from any text using advanced AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Smart content extraction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Multiple card formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Quality review system</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Review Mode</CardTitle>
                <CardDescription>
                  Review and refine AI-generated cards before studying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Accept or reject cards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Edit on the fly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Batch operations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Learning Heatmap</CardTitle>
                <CardDescription>
                  Track your progress with beautiful visual statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Daily activity tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Streak monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span>Performance insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lesson Builder Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Lesson & Flashcards</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nhập nội dung, AI lo phần còn lại
              </h2>
              <p className="text-muted-foreground mb-6">
                Nhập chủ đề, dán tài liệu và (tuỳ chọn) link nguồn. AI sẽ phân
                tích, sinh Lesson và bộ Flashcards, rồi đưa vào SRS.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Không cần cài extension</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Hỗ trợ dán text hoặc link</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>Auto đưa vào SRS để ôn tập</span>
                </li>
              </ul>
              <Button
                className="cursor-pointer"
                size="lg"
                onClick={() => navigate("/lesson")}
              >
                Mở Lesson Builder
              </Button>
            </div>
            <div className="bg-background rounded-lg shadow-xl p-6 border">
              <div className="aspect-video bg-muted rounded flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students already learning smarter with our
            platform
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 cursor-pointer"
              onClick={handClickLogin}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 cursor-pointer"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
