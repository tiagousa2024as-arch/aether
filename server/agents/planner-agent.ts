/**
 * PlannerAgent - Turns a user command into an execution plan (ordered steps).
 * Uses LLM (OpenAI or Anthropic) when configured; otherwise rule-based templates.
 */

import type { ExecutionPlan, TaskStep } from "./types";

function randomId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const AGENT_TYPES = ["research", "code", "automation", "memory"] as const;

/** JSON schema for LLM-structured plan output (steps only; we add id/planId). */
const PLAN_STEPS_SCHEMA = {
  type: "object",
  properties: {
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["research", "code", "automation", "memory"] },
          title: { type: "string" },
          description: { type: "string" },
          order: { type: "number" },
        },
        required: ["type", "title", "order"],
      },
    },
  },
  required: ["steps"],
} as const;

/** Simulated plan templates keyed by command keywords. */
const PLAN_TEMPLATES: Array<{
  keywords: string[];
  steps: Array<{ type: (typeof AGENT_TYPES)[number]; title: string; description: string }>;
}> = [
  {
    keywords: ["presentation", "slides", "deck", "ppt"],
    steps: [
      { type: "research", title: "Research topic", description: "Gather key facts and sources" },
      { type: "memory", title: "Generate outline", description: "Structure content and sections" },
      { type: "code", title: "Create slides", description: "Build slide content and layout" },
      { type: "automation", title: "Export file", description: "Export to PDF or PPTX" },
    ],
  },
  {
    keywords: ["code", "implement", "script", "app", "function"],
    steps: [
      { type: "research", title: "Research approach", description: "Find best practices and APIs" },
      { type: "memory", title: "Plan implementation", description: "Break down into tasks" },
      { type: "code", title: "Implement solution", description: "Write and structure code" },
      { type: "automation", title: "Validate and test", description: "Run checks and tests" },
    ],
  },
  {
    keywords: ["report", "summary", "document", "write"],
    steps: [
      { type: "research", title: "Gather information", description: "Collect data and sources" },
      { type: "memory", title: "Outline structure", description: "Define sections and flow" },
      { type: "code", title: "Draft content", description: "Generate first draft" },
      { type: "automation", title: "Format and export", description: "Finalize and export" },
    ],
  },
  {
    keywords: ["automate", "schedule", "workflow", "trigger"],
    steps: [
      { type: "research", title: "Analyze workflow", description: "Identify steps and triggers" },
      { type: "memory", title: "Design automation", description: "Plan flow and conditions" },
      { type: "automation", title: "Configure automation", description: "Set up triggers and actions" },
      { type: "memory", title: "Store in memory", description: "Persist for future use" },
    ],
  },
];

function matchTemplate(command: string): typeof PLAN_TEMPLATES[0]["steps"] | null {
  const lower = command.toLowerCase();
  for (const template of PLAN_TEMPLATES) {
    if (template.keywords.some((k) => lower.includes(k))) {
      return template.steps;
    }
  }
  return null;
}

/** Default plan when no template matches. */
function defaultPlan(): typeof PLAN_TEMPLATES[0]["steps"] {
  return [
    { type: "research", title: "Research context", description: "Gather relevant context" },
    { type: "memory", title: "Plan steps", description: "Organize approach" },
    { type: "code", title: "Execute task", description: "Perform main work" },
    { type: "automation", title: "Finalize", description: "Complete and deliver" },
  ];
}

/**
 * Generate an execution plan from a user command (sync, rule-based fallback).
 */
export function generatePlan(command: string): ExecutionPlan {
  const planId = randomId();
  const stepsTemplate = matchTemplate(command) ?? defaultPlan();
  const steps: TaskStep[] = stepsTemplate.map((s, i) => ({
    id: `${planId}-step-${i}`,
    type: s.type,
    title: s.title,
    description: s.description,
    payload: { command },
    order: i,
  }));

  return {
    id: planId,
    command,
    steps,
    createdAt: Date.now(),
  };
}

/**
 * Generate an execution plan using the configured LLM when available.
 * Falls back to rule-based generatePlan() if no LLM or on error.
 */
export async function generatePlanAsync(command: string): Promise<ExecutionPlan> {
  try {
    const { getActiveLLMProvider, generateStructuredOutput } = await import("@/modules/agents/llm-provider");
    if (!getActiveLLMProvider()) return generatePlan(command);

    const raw = await generateStructuredOutput<{ steps: Array<{ type: string; title: string; description?: string; order: number }> }>({
      prompt: `Given this user command, produce an execution plan with 3-6 steps. Each step must have type (one of: research, code, automation, memory), title, description, and order (0-based). Command: "${command}"`,
      systemPrompt: "You are a workflow planner. Output only valid JSON with a 'steps' array. Each step: type (research|code|automation|memory), title, description, order.",
      schema: PLAN_STEPS_SCHEMA as unknown as Record<string, unknown>,
      maxTokens: 1024,
    });

    if (!raw?.steps?.length) return generatePlan(command);

    const planId = randomId();
    const steps: TaskStep[] = raw.steps
      .filter((s) => AGENT_TYPES.includes(s.type as (typeof AGENT_TYPES)[number]))
      .map((s, i) => ({
        id: `${planId}-step-${i}`,
        type: s.type as TaskStep["type"],
        title: s.title ?? "Step",
        description: s.description,
        payload: { command },
        order: s.order ?? i,
      }));

    if (steps.length === 0) return generatePlan(command);

    return { id: planId, command, steps, createdAt: Date.now() };
  } catch {
    return generatePlan(command);
  }
}
