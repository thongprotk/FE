import apiClient from '@/lib/api-client';
import type {
    Card,
    CreateCardDto,
    UpdateCardDto,
    ReviewCardDto,
    PaginatedResponse,
} from '@/types/api';

export const cardService = {
    /**
     * Get all cards in a deck
     */
    async getAll(
        deckId: string,
        params?: {
            limit?: number;
            offset?: number;
            status?: string;
        }
    ): Promise<PaginatedResponse<Card>> {
        const response = await apiClient.get<PaginatedResponse<Card>>(
            `/decks/${deckId}/cards`,
            { params }
        );
        return response.data;
    },

    /**
     * Get single card by ID
     */
    async getById(deckId: string, cardId: string): Promise<Card> {
        const response = await apiClient.get<Card>(`/decks/${deckId}/cards/${cardId}`);
        return response.data;
    },

    /**
     * Create a new card
     */
    async create(deckId: string, data: CreateCardDto): Promise<Card> {
        const response = await apiClient.post<Card>(`/decks/${deckId}/cards`, data);
        return response.data;
    },

    /**
     * Update card
     */
    async update(deckId: string, cardId: string, data: UpdateCardDto): Promise<Card> {
        const response = await apiClient.patch<Card>(
            `/decks/${deckId}/cards/${cardId}`,
            data
        );
        return response.data;
    },

    /**
     * Delete card
     */
    async delete(deckId: string, cardId: string): Promise<void> {
        await apiClient.delete(`/decks/${deckId}/cards/${cardId}`);
    },

    /**
     * Review card with SM-2 algorithm
     */
    async review(deckId: string, cardId: string, data: ReviewCardDto): Promise<Card> {
        const response = await apiClient.post<Card>(
            `/decks/${deckId}/cards/${cardId}/review`,
            data
        );
        return response.data;
    },

    /**
     * Get cards due for review
     */
    async getDueCards(deckId: string): Promise<Card[]> {
        const response = await apiClient.get<Card[]>(`/decks/${deckId}/cards/due`);
        return response.data;
    },

    /**
     * Reset card schedule
     */
    async resetSchedule(deckId: string, cardId: string): Promise<Card> {
        const response = await apiClient.post<Card>(
            `/decks/${deckId}/cards/${cardId}/reset`
        );
        return response.data;
    },

    /**
     * Bulk create cards
     */
    async bulkCreate(deckId: string, cards: CreateCardDto[]): Promise<Card[]> {
        const response = await apiClient.post<Card[]>(
            `/decks/${deckId}/cards/bulk`,
            { cards }
        );
        return response.data;
    },
};
