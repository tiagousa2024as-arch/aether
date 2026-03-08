/**
 * Agent system types - Shared across all agents and the runner.
 * Designed for easy swap to real AI (LLM) later.
 */

export type AgentType =
  | "planner"
  | "research"
  | "code"
  | "automation"
  | "memory";

export type StepStatus = "pending" | "running" | "completed" | "failed";

/** A single step in an execution plan (output of PlannerAgent). */
export interface TaskStep {
  id: string;
  type: AgentType;
  title: string;
  description?: string;
  /** Optional payload for the agent (e.g. topic, outline). */
  payload?: Record<string, unknown>;
  order: number;
}

/** Full execution plan (output of PlannerAgent). */
export interface ExecutionPlan {
  id: string;
  command: string;
  steps: TaskStep[];
  createdAt: number;
}

/** Result of one agent executing a step. */
export interface StepResult {
  stepId: string;
  status: StepStatus;
  output?: string;
  error?: string;
  durationMs?: number;
  /** For future: artifacts (e.g. file IDs, URLs). */
  artifacts?: Record<string, unknown>;
}

/** Context passed to execution agents (memory, previous step outputs, etc.). */
export interface ExecutionContext {
  planId: string;
  command: string;
  previousResults: StepResult[];
  /** Optional user/workspace context for real AI later. */
  metadata?: Record<string, unknown>;
}

/** Base interface for all execution agents. */
export interface IAgent {
  readonly type: AgentType;
  execute(step: TaskStep, context: ExecutionContext): Promise<StepResult>;
}
