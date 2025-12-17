import apiClient from '@/lib/api-client';
import type {
    Deck,
    CreateDeckDto,
    UpdateDeckDto,
    PaginatedResponse,
} from '@/types/api';

export const deckService = {
    /**
     * Get all decks for current user
     */
    async getAll(params?: {
        limit?: number;
        offset?: number;
        ownerId?: string;
    }): Promise<PaginatedResponse<Deck>> {
        const response = await apiClient.get<PaginatedResponse<Deck>>('/decks', {
            params,
        });
        return response.data;
    },

    /**
     * Get public decks (no auth required)
     */
    async getPublic(params?: {
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Deck>> {
        const response = await apiClient.get<PaginatedResponse<Deck>>('/decks/public', {
            params,
        });
        return response.data;
    },

    /**
     * Get single deck by ID
     */
    async getById(deckId: string): Promise<Deck> {
        const response = await apiClient.get<Deck>(`/decks/${deckId}`);
        return response.data;
    },

    /**
     * Create a new deck
     */
    async create(data: CreateDeckDto): Promise<Deck> {
        const response = await apiClient.post<Deck>('/decks', data);
        return response.data;
    },

    /**
     * Update deck
     */
    async update(deckId: string, data: UpdateDeckDto): Promise<Deck> {
        const response = await apiClient.patch<Deck>(`/decks/${deckId}`, data);
        return response.data;
    },

    /**
     * Delete deck
     */
    async delete(deckId: string): Promise<void> {
        await apiClient.delete(`/decks/${deckId}`);
    },

    /**
     * Get cards due for review in a deck
     */
    async getDueCards(deckId: string): Promise<number> {
        const response = await apiClient.get<{ count: number }>(`/decks/${deckId}/due-cards`);
        return response.data.count;
    },
};
