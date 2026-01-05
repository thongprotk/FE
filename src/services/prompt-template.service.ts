import { apiClient } from "./api-client";

export interface PromptTemplate {
    id: string;
    templateKey: string;
    name: string;
    description: string;
    template: string;
    category: string;
    isActive: boolean;
    priority: number;
    createdAt: string;
    updatedAt: string;
}

class PromptTemplateService {
    private readonly baseUrl = "/resources/prompt-templates";

    async getAll(): Promise<PromptTemplate[]> {
        return apiClient.get<PromptTemplate[]>(this.baseUrl);
    }


    async getByCategory(category: string): Promise<PromptTemplate[]> {
        return apiClient.get<PromptTemplate[]>(
            `${this.baseUrl}/category/${category}`
        );
    }

    async getByKey(templateKey: string): Promise<PromptTemplate> {
        return apiClient.get<PromptTemplate>(
            `${this.baseUrl}/key/${templateKey}`
        );
    }

    async getDefaultFlashcardTemplate(): Promise<PromptTemplate> {
        return apiClient.get<PromptTemplate>(
            `${this.baseUrl}/default/flashcard`
        );
    }


    buildPrompt(
        template: string,
        options: {
            url?: string;
            title?: string;
            content: string;
            count?: number;
        }
    ): string {
        let prompt = template;

        // Replace placeholders
        prompt = prompt.replace(/{URL}/g, options.url || "Not provided");
        prompt = prompt.replace(/{TITLE}/g, options.title || "Untitled Resource");
        prompt = prompt.replace(/{CONTENT}/g, options.content);
        prompt = prompt.replace(/{COUNT}/g, (options.count || 8).toString());

        return prompt;
    }
}

export const promptTemplateService = new PromptTemplateService();
