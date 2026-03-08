/**
 * MemoryAgent - Simulated memory/outline/planning step.
 * Future: read/write to vector store or knowledge base.
 */

import { BaseAgent } from "./base";
import type { ExecutionContext, StepResult, TaskStep } from "./types";

const SIMULATED_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MemoryAgent extends BaseAgent {
  readonly type = "memory" as const;

  async execute(step: TaskStep, context: ExecutionContext): Promise<StepResult> {
    const start = Date.now();
    await sleep(SIMULATED_DELAY_MS);
    const durationMs = Date.now() - start;
    const output =
      step.title.toLowerCase().includes("outline") || step.title.toLowerCase().includes("structure")
        ? `Outline and structure created for: "${context.command.slice(0, 50)}…".`
        : `Stored and organized for next steps.`;
    return this.success(step.id, output, durationMs);
  }
}
