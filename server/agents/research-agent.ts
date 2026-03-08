/**
 * ResearchAgent - Simulated research step.
 * Future: call search API / RAG / LLM for real research.
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
    await sleep(SIMULATED_DELAY_MS);
    const durationMs = Date.now() - start;
    const topic = (step.payload?.command as string) ?? context.command;
    return this.success(
      step.id,
      `Research completed for: "${topic.slice(0, 60)}${topic.length > 60 ? "…" : ""}". Key points gathered; sources noted for next step.`,
      durationMs
    );
  }
}
