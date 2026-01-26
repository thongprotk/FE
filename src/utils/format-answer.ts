/**
 * Format AI-generated answer text for better readability
 * - Splits by newlines and numbered lists
 * - Converts bullet points (•, -, *) to proper format
 * - Cleans up excessive whitespace
 */
export interface FormattedLine {
  type: "text" | "bullet" | "number" | "heading";
  content: string;
  indent: number;
  order?: number;
}

export function formatAnswer(text: string): FormattedLine[] {
  if (!text) return [];

  const normalized = text.replace(/(\d+\.)\s+/g, "\n$1 ").trim();

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const formatted: FormattedLine[] = [];

  for (const line of lines) {
    // Check for numbered list (1. 2. etc)
    const numberMatch = line.match(/^(\d+)\.\s*(.+)/);
    if (numberMatch) {
      formatted.push({
        type: "number",
        order: Number(numberMatch[1]),
        content: numberMatch[2],
        indent: 0,
      });
      continue;
    }

    // Check for bullet points
    const bulletMatch = line.match(/^[•\-\*]\s*(.+)/);
    if (bulletMatch) {
      formatted.push({
        type: "bullet",
        content: bulletMatch[1],
        indent: 0,
      });
      continue;
    }

    // Check for bold text (used as heading/emphasis)
    if (line.startsWith("**") && line.endsWith("**")) {
      formatted.push({
        type: "heading",
        content: line.replace(/\*\*/g, ""),
        indent: 0,
      });
      continue;
    }

    // Regular text
    formatted.push({
      type: "text",
      content: line,
      indent: 0,
    });
  }

  return formatted;
}

/**
 * Convert formatted lines to plain text
 */
export function formatAnswerToText(formattedLines: FormattedLine[]): string {
  return formattedLines
    .map((line) => {
      switch (line.type) {
        case "bullet":
          return `• ${line.content}`;
        case "number":
          return `${line.order}. ${line.content}`;
        case "heading":
          return `${line.content}`;
        default:
          return line.content;
      }
    })
    .join("\n");
}

/**
 * Clean up AI response by removing extra numbering/formatting
 * Useful for removing numbered sections that were meant for internal structure
 */
export function cleanAIResponse(text: string): string {
  let cleaned = text;

  // Remove numbered sections at start if they're metadata
  // e.g., "1. Thinking: ...", "2. Reasoning: ..."
  cleaned = cleaned
    .replace(/^\d+\.\s*\*\*[^*]+\*\*:\s*/gm, "")
    .replace(/^\d+\.\s*[A-Z][a-z]+:\s*/gm, "");

  // Remove all markdown formatting
  // Remove bold (**text** or __text__)
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "$1");
  cleaned = cleaned.replace(/__(.+?)__/g, "$1");

  // Remove italic (*text* or _text_)
  cleaned = cleaned.replace(/\*(.+?)\*/g, "$1");
  cleaned = cleaned.replace(/_(.+?)_/g, "$1");

  // Remove remaining asterisks and underscores that aren't needed
  cleaned = cleaned.replace(/[\*_]+/g, "");

  // Remove all double quotes (") - common in AI responses
  cleaned = cleaned.replace(/"/g, "");

  // Remove smart quotes (" ")
  cleaned = cleaned.replace(/[""]/g, "");

  // Remove single quotes if they're wrapping text (but keep apostrophes in words)
  cleaned = cleaned.replace(/^'|'$/gm, "");

  // Remove markdown headings (# ## ### etc)
  cleaned = cleaned.replace(/^#+\s+/gm, "");

  // Remove inline code markers (`)
  cleaned = cleaned.replace(/`/g, "");

  // Remove extra markdown symbols
  cleaned = cleaned.replace(/[~^]/g, "");

  // Normalize line breaks (multiple to single)
  cleaned = cleaned.replace(/\n\n+/g, "\n");

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}
