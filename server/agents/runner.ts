/**
 * Agent runner - Executes a single step via the appropriate agent.
 * Keeps agent registry; designed to add more agents without changing callers.
 */

import type { ExecutionContext, StepResult, TaskStep } from "./types";
import { ResearchAgent } from "./research-agent";
import { CodeAgent } from "./code-agent";
import { AutomationAgent } from "./automation-agent";
import { MemoryAgent } from "./memory-agent";

const researchAgent = new ResearchAgent();
const codeAgent = new CodeAgent();
const automationAgent = new AutomationAgent();
const memoryAgent = new MemoryAgent();

const AGENTS = {
  research: researchAgent,
  code: codeAgent,
  automation: automationAgent,
  memory: memoryAgent,
} as const;

export type RunnableAgentType = keyof typeof AGENTS;

export function getAgent(type: RunnableAgentType) {
  const agent = AGENTS[type];
  if (!agent) throw new Error(`Unknown agent type: ${type}`);
  return agent;
}

/**
 * Execute one step. Uses ExecutionContext.previousResults for chain.
 */
export async function executeStep(
  step: TaskStep,
  context: ExecutionContext
): Promise<StepResult> {
  if (step.type === "planner") {
    return {
      stepId: step.id,
      status: "failed",
      error: "Planner cannot be run as an execution step",
      durationMs: 0,
    };
  }
  const agent = getAgent(step.type as RunnableAgentType);
  return agent.execute(step, context);
}

/**
 * Execute a full plan step-by-step. Returns results in order.
 * For dashboard simulation; can be called from tRPC or server actions.
 */
export async function executePlan(
  plan: { id: string; command: string; steps: TaskStep[] },
  onStepComplete?: (result: StepResult) => void
): Promise<StepResult[]> {
  const results: StepResult[] = [];
  for (const step of plan.steps.sort((a, b) => a.order - b.order)) {
    const context: ExecutionContext = {
      planId: plan.id,
      command: plan.command,
      previousResults: [...results],
    };
    const result = await executeStep(step, context);
    results.push(result);
    onStepComplete?.(result);
  }
  return results;
}
