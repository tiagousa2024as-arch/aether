/**
 * Anthropic connector configuration — Phase 3.
 * Set ANTHROPIC_API_KEY to enable.
 */

export function getAnthropicConfig(): { apiKey: string } | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key?.trim()) return null;
  return { apiKey: key.trim() };
}
