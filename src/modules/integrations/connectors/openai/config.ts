/**
 * OpenAI connector configuration.
 * Server-side only. Key from OPENAI_API_KEY env.
 */

function getApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY;
}

export function getOpenAIConfig(): { apiKey: string } | null {
  const apiKey = getApiKey();
  if (!apiKey?.trim()) return null;
  return { apiKey: apiKey.trim() };
}

export const OPENAI_DEFAULT_MODEL = "gpt-4o-mini";
export const OPENAI_STRUCTURED_MODEL = "gpt-4o";
