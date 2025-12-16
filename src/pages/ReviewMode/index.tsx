import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Edit2, SkipForward, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data - trong thực tế sẽ fetch từ API
const mockFlashcards = [
    {
        id: 1,
        front: "What is React?",
        back: "React is a JavaScript library for building user interfaces, particularly single-page applications.",
        source: "AI Generated",
        confidence: 0.95
    },
    {
        id: 2,
        front: "What is a Component in React?",
        back: "A component is a reusable piece of code that returns a React element to be rendered on the page.",
        source: "AI Generated",
        confidence: 0.88
    },
    {
        id: 3,
        front: "What are React Hooks?",
        back: "Hooks are functions that let you use state and other React features in functional components.",
        source: "AI Generated",
        confidence: 0.92
    },
    {
        id: 4,
        front: "What is useState?",
        back: "useState is a Hook that lets you add state to functional components.",
        source: "AI Generated",
        confidence: 0.90
    },
    {
        id: 5,
        front: "What is useEffect?",
        back: "useEffect is a Hook that lets you perform side effects in functional components.",
        source: "AI Generated",
        confidence: 0.87
    }
]

export default function ReviewMode() {
    const [cards] = useState(mockFlashcards)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const [editedFront, setEditedFront] = useState("")
    const [editedBack, setEditedBack] = useState("")
    const [reviewedCards, setReviewedCards] = useState<{[key: number]: 'accepted' | 'rejected'}>({})
    const [isFlipped, setIsFlipped] = useState(false)

    const currentCard = cards[currentIndex]
    const progress = (Object.keys(reviewedCards).length / cards.length) * 100
    const acceptedCount = Object.values(reviewedCards).filter(v => v === 'accepted').length
    const rejectedCount = Object.values(reviewedCards).filter(v => v === 'rejected').length

    const handleEdit = () => {
        setEditedFront(currentCard.front)
        setEditedBack(currentCard.back)
        setIsEditing(true)
    }

    const handleSaveEdit = () => {
        // Trong thực tế sẽ gửi API để cập nhật
        console.log("Saved:", { front: editedFront, back: editedBack })
        setIsEditing(false)
        handleAccept()
    }

    const handleAccept = () => {
        setReviewedCards(prev => ({ ...prev, [currentCard.id]: 'accepted' }))
        nextCard()
    }

    const handleReject = () => {
        setReviewedCards(prev => ({ ...prev, [currentCard.id]: 'rejected' }))
        nextCard()
    }

    const handleSkip = () => {
        nextCard()
    }

    const nextCard = () => {
        setIsFlipped(false)
        setIsEditing(false)
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const previousCard = () => {
        setIsFlipped(false)
        setIsEditing(false)
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.9) return "bg-green-500"
        if (confidence >= 0.8) return "bg-yellow-500"
        return "bg-orange-500"
    }

    if (currentIndex >= cards.length) {
        return (
            <div className="container mx-auto max-w-4xl py-12 px-4">
                <Card className="text-center p-12">
                    <CardHeader>
                        <CardTitle className="text-3xl mb-4">🎉 Review Complete!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                            <div className="p-4 bg-muted rounded-lg">
                                <div className="text-3xl font-bold">{cards.length}</div>
                                <div className="text-sm text-muted-foreground">Total Cards</div>
                            </div>
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="text-3xl font-bold text-green-600">{acceptedCount}</div>
                                <div className="text-sm text-muted-foreground">Accepted</div>
                            </div>
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
                                <div className="text-sm text-muted-foreground">Rejected</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Button size="lg" onClick={() => window.location.reload()}>
                                Review Again
                            </Button>
                            <div>
                                <Button variant="link" onClick={() => setCurrentIndex(0)}>
                                    Go to Start
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold">Review AI Cards</h1>
                        <p className="text-muted-foreground">
                            Review and approve AI-generated flashcards
                        </p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                        {currentIndex + 1} / {cards.length}
                    </Badge>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600">✓ {acceptedCount} accepted</span>
                        <span className="text-red-600">✗ {rejectedCount} rejected</span>
                    </div>
                </div>
            </div>

            {/* Flashcard */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{currentCard.source}</Badge>
                            <Badge
                                variant="secondary"
                                className={`${getConfidenceColor(currentCard.confidence)} text-white`}
                            >
                                {Math.round(currentCard.confidence * 100)}% confidence
                            </Badge>
                        </div>
                        {reviewedCards[currentCard.id] && (
                            <Badge
                                variant={reviewedCards[currentCard.id] === 'accepted' ? 'default' : 'destructive'}
                            >
                                {reviewedCards[currentCard.id] === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Front</label>
                                <Textarea
                                    value={editedFront}
                                    onChange={(e) => setEditedFront(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Back</label>
                                <Textarea
                                    value={editedBack}
                                    onChange={(e) => setEditedBack(e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSaveEdit}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save & Accept
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="min-h-[300px] flex flex-col items-center justify-center cursor-pointer p-8"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {!isFlipped ? (
                                <div className="text-center space-y-4">
                                    <p className="text-sm text-muted-foreground uppercase tracking-wide">Question</p>
                                    <h2 className="text-2xl font-semibold">{currentCard.front}</h2>
                                    <p className="text-sm text-muted-foreground">Click to reveal answer</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <p className="text-sm text-muted-foreground uppercase tracking-wide">Answer</p>
                                    <p className="text-xl">{currentCard.back}</p>
                                    <p className="text-sm text-muted-foreground">Click to flip back</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Alert */}
            {!isEditing && (
                <Alert className="mb-6">
                    <AlertDescription>
                        💡 <strong>Tip:</strong> Click the card to flip between question and answer.
                        Review carefully before accepting or rejecting.
                    </AlertDescription>
                </Alert>
            )}

            {/* Action Buttons */}
            {!isEditing && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                        variant="destructive"
                        size="lg"
                        onClick={handleReject}
                        className="w-full"
                    >
                        <XCircle className="mr-2 h-5 w-5" />
                        Reject
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleEdit}
                        className="w-full"
                    >
                        <Edit2 className="mr-2 h-5 w-5" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleSkip}
                        className="w-full"
                    >
                        <SkipForward className="mr-2 h-5 w-5" />
                        Skip
                    </Button>
                    <Button
                        variant="default"
                        size="lg"
                        onClick={handleAccept}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Accept
                    </Button>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <Button
                    variant="ghost"
                    onClick={previousCard}
                    disabled={currentIndex === 0}
                >
                    ← Previous
                </Button>
                <Button
                    variant="ghost"
                    onClick={nextCard}
                    disabled={currentIndex === cards.length - 1}
                >
                    Next →
                </Button>
            </div>
        </div>
    )
}

