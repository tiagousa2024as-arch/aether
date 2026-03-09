/**
 * Anthropic tools — generate_plan.
 * Allowed agents: planner_agent, research_agent.
 */

import { z } from "zod";
import { registerTool } from "../registry";
import type { AetherTool } from "../types";
import * as anthropic from "@/modules/integrations/connectors/anthropic/client";

const generatePlanInput = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
});

const PLAN_SCHEMA = {
  type: "object",
  properties: {
    goal: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          order: { type: "number" },
        },
        required: ["type", "title", "order"],
      },
    },
  },
  required: ["goal", "steps"],
} as const;

export const anthropicGeneratePlan: AetherTool<
  z.infer<typeof generatePlanInput>,
  { goal: string; steps: Array<{ type: string; title: string; description?: string; order: number }> }
> = {
  name: "anthropic.generate_plan",
  description: "Generate a structured workflow plan using Anthropic.",
  connector: "anthropic",
  allowedAgents: ["planner_agent", "research_agent"],
  inputSchema: generatePlanInput,
  async execute(input, _context) {
    const raw = await anthropic.createMessageStructured<{ goal: string; steps: Array<{ type: string; title: string; description?: string; order: number }> }>({
      prompt: input.prompt,
      systemPrompt: input.systemPrompt ?? "Output valid JSON with goal and steps array.",
      schema: PLAN_SCHEMA as unknown as Record<string, unknown>,
      maxTokens: 1024,
    });
    return raw;
  },
};

export function registerAnthropicTools(): void {
  registerTool(anthropicGeneratePlan);
}
