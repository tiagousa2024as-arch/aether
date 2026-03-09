/**
 * OpenAI tools — generate_text, generate_structured_plan.
 * Allowed agents: planner_agent, research_agent.
 */

import { z } from "zod";
import { registerTool } from "../registry";
import type { AetherTool } from "../types";
import * as openai from "@/modules/integrations/connectors/openai/client";

const generateTextInput = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
  maxTokens: z.number().optional(),
});

const generateStructuredPlanInput = z.object({
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
  goal: z.string().optional(),
});

const ALLOWED = ["planner_agent", "research_agent"];

export const openaiGenerateText: AetherTool<z.infer<typeof generateTextInput>, string> = {
  name: "openai.generate_text",
  description: "Generate text using OpenAI chat completion.",
  connector: "openai",
  allowedAgents: ALLOWED,
  inputSchema: generateTextInput,
  async execute(input, _context) {
    const text = await openai.generateText({
      prompt: input.prompt,
      systemPrompt: input.systemPrompt,
      maxTokens: input.maxTokens,
    });
    return text;
  },
};

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

export const openaiGenerateStructuredPlan: AetherTool<
  z.infer<typeof generateStructuredPlanInput>,
  { goal: string; steps: Array<{ type: string; title: string; description?: string; order: number }> }
> = {
  name: "openai.generate_structured_plan",
  description: "Generate a structured workflow plan (goal + steps) using OpenAI.",
  connector: "openai",
  allowedAgents: ALLOWED,
  inputSchema: generateStructuredPlanInput,
  async execute(input, _context) {
    const raw = await openai.generateStructuredOutput<{ goal: string; steps: Array<{ type: string; title: string; description?: string; order: number }> }>({
      prompt: input.prompt,
      systemPrompt: input.systemPrompt ?? "Output valid JSON with goal and steps array. Each step: type, title, description, order.",
      schema: PLAN_SCHEMA as unknown as Record<string, unknown>,
      maxTokens: 1024,
    });
    return raw;
  },
};

export function registerOpenAITools(): void {
  registerTool(openaiGenerateText);
  registerTool(openaiGenerateStructuredPlan);
}
