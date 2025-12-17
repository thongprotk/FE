import apiClient from '@/lib/api-client';
import type {
    LearningOverview,
    DailyActivity,
} from '@/types/api';

export const analyticsService = {
    /**
     * Get learning overview statistics
     */
    async getOverview(): Promise<LearningOverview> {
        const response = await apiClient.get<LearningOverview>('/analytics/overview');
        return response.data;
    },

    /**
     * Get activity history
     */
    async getActivity(days: number = 365): Promise<DailyActivity[]> {
        const response = await apiClient.get<DailyActivity[]>('/analytics/activity', {
            params: { days },
        });
        return response.data;
    },

    /**
     * Get deck statistics
     */
    async getDeckStats(deckId: string): Promise<{
        totalCards: number;
        dueCards: number;
        masteredCards: number;
        learningCards: number;
        newCards: number;
    }> {
        const response = await apiClient.get(`/analytics/decks/${deckId}`);
        return response.data;
    },

    /**
     * Trigger activity cache update
     */
    async refreshActivity(): Promise<void> {
        await apiClient.post('/analytics/refresh-activity');
    },
};
