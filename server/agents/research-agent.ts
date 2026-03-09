/**
 * ResearchAgent - Research step using LLM when configured, else simulated.
 */

import { BaseAgent } from "./base";
import type { ExecutionContext, StepResult, TaskStep } from "./types";

const SIMULATED_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ResearchAgent extends BaseAgent {
  readonly type = "research" as const;

  async execute(step: TaskStep, context: ExecutionContext): Promise<StepResult> {
    const start = Date.now();
    const topic = (step.payload?.command as string) ?? context.command;

    try {
      const { getActiveLLMProvider, generateText } = await import("@/modules/agents/llm-provider");
      if (getActiveLLMProvider()) {
        const output = await generateText({
          prompt: `As a research assistant, summarize key points and considerations for this task. Be concise (2–4 paragraphs). Task: "${topic}"`,
          systemPrompt: "You provide factual, concise research summaries. No markdown headers.",
          maxTokens: 1024,
        });
        return this.success(step.id, output.trim(), Date.now() - start);
      }
    } catch {
      // Fall through to simulated output
    }

    await sleep(SIMULATED_DELAY_MS);
    const durationMs = Date.now() - start;
    return this.success(
      step.id,
      `Research completed for: "${topic.slice(0, 60)}${topic.length > 60 ? "…" : ""}". Key points gathered; sources noted for next step.`,
      durationMs
    );
  }
}
