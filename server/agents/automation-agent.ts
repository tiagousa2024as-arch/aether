/**
 * AutomationAgent - Simulated automation/export step.
 * Future: trigger real workflows, exports, integrations.
 */

import { BaseAgent } from "./base";
import type { ExecutionContext, StepResult, TaskStep } from "./types";

const SIMULATED_DELAY_MS = 600;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class AutomationAgent extends BaseAgent {
  readonly type = "automation" as const;

  async execute(step: TaskStep, context: ExecutionContext): Promise<StepResult> {
    const start = Date.now();
    await sleep(SIMULATED_DELAY_MS);
    const durationMs = Date.now() - start;
    const action = step.title.toLowerCase().includes("export") ? "Exported" : "Completed";
    return this.success(
      step.id,
      `${action} successfully. Output saved and ready for use.`,
      durationMs
    );
  }
}
