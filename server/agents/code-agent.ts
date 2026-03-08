/**
 * CodeAgent - Simulated code/content generation step.
 * Future: call LLM or code execution sandbox.
 */

import { BaseAgent } from "./base";
import type { ExecutionContext, StepResult, TaskStep } from "./types";

const SIMULATED_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class CodeAgent extends BaseAgent {
  readonly type = "code" as const;

  async execute(step: TaskStep, context: ExecutionContext): Promise<StepResult> {
    const start = Date.now();
    await sleep(SIMULATED_DELAY_MS);
    const durationMs = Date.now() - start;
    const output =
      step.title.toLowerCase().includes("slide") || step.title.toLowerCase().includes("content")
        ? `Generated content for "${context.command.slice(0, 40)}…". Ready for export.`
        : `Task "${step.title}" completed. Output prepared for next step.`;
    return this.success(step.id, output, durationMs);
  }
}
