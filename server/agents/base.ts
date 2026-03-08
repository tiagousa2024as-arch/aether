/**
 * Base agent - Abstract class implementing IAgent.
 * Subclasses define type and execute(); designed for future LLM integration.
 */

import type { AgentType, ExecutionContext, IAgent, StepResult, TaskStep } from "./types";

export abstract class BaseAgent implements IAgent {
  abstract readonly type: AgentType;

  abstract execute(step: TaskStep, context: ExecutionContext): Promise<StepResult>;

  /** Helper to build a success result. */
  protected success(
    stepId: string,
    output: string,
    durationMs: number,
    artifacts?: Record<string, unknown>
  ): StepResult {
    return {
      stepId,
      status: "completed",
      output,
      durationMs,
      artifacts,
    };
  }

  /** Helper to build a failure result. */
  protected failure(stepId: string, error: string, durationMs: number): StepResult {
    return {
      stepId,
      status: "failed",
      error,
      durationMs,
    };
  }
}
