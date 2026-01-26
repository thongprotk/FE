import apiClient from "@/lib/api-client";
import type { Resource, CreateResourceDto } from "@/types/api";

export const resourceService = {
  /**
   * Get all resources for current user
   */
  async getAll(): Promise<Resource[]> {
    const response = await apiClient.get<Resource[]>("/resources");
    return response.data;
  },

  /**
   * Get single resource by ID
   */
  async getById(resourceId: string): Promise<Resource> {
    const response = await apiClient.get<Resource>(`/resources/${resourceId}`);
    return response.data;
  },

  /**
   * Create a new resource (parse HTML content)
   */
  async create(data: CreateResourceDto): Promise<Resource> {
    const response = await apiClient.post<Resource>("/resources", data);
    return response.data;
  },

  /**
   * Delete resource
   */
  async delete(resourceId: string): Promise<void> {
    await apiClient.delete(`/resources/${resourceId}`);
  },

  /**
   * Generate flashcards from resource
   */
  async generateFlashcards(
    resourceId: string,
    deckId: string,
  ): Promise<{ message: string; count: number }> {
    const response = await apiClient.post<{ message: string; count: number }>(
      `/resources/${resourceId}/generate-flashcards`,
      { deckId },
    );
    return response.data;
  },
};
