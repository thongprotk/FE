// API Response Types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
}

// User & Auth Types
export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    picture?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface AuthResponse {
    accessToken: string;
    user?: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles?: string[];
    picture?: string;
}

// Deck Types
export interface Deck {
    id: string;
    title: string;
    description?: string;
    isPublic: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    cardCount?: number;
    dueCardCount?: number;
}

export interface CreateDeckDto {
    title: string;
    description?: string;
    isPublic?: boolean;
}

export interface UpdateDeckDto {
    title?: string;
    description?: string;
    isPublic?: boolean;
}

// Card Types
export type CardStatus = 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED' | 'RELEARNING';

export interface Card {
    id: string;
    frontContent: string;
    backContent: string;
    note?: string;
    easinessFactor: number;
    interval: number;
    repetition: number;
    nextReviewDate: string;
    status: CardStatus;
    deckId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCardDto {
    frontContent: string;
    backContent: string;
    note?: string;
}

export interface UpdateCardDto {
    frontContent?: string;
    backContent?: string;
    note?: string;
}

export interface ReviewCardDto {
    quality: number; // 0-5 for SM-2 algorithm
}

// Analytics Types
export interface LearningOverview {
    totalCards: number;
    dueCards: number;
    masteredCards: number;
    learningCards: number;
    newCards: number;
    totalDecks: number;
    recentActivity: DailyActivity[];
}

export interface DailyActivity {
    date: string;
    reviewed: number;
    mastered: number;
    learning: number;
}

export interface ActivityHeatmap {
    date: string;
    count: number;
}

// Resource Types
export interface Resource {
    id: string;
    title: string;
    url: string;
    content: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateResourceDto {
    title: string;
    url: string;
    content: string;
}

// Error Types
export interface ApiError {
    message: string;
    error?: string;
    statusCode: number;
}
