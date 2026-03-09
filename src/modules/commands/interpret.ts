/**
 * OpenAI command interpretation: natural language → structured workflow.
 * Validates output with Zod.
 */

import { z } from "zod";
import * as openai from "@/modules/integrations/connectors/openai/client";

const stepSchema = z.object({
  type: z.enum(["salesforce_create_lead", "microsoft_teams_message"]),
  input: z.record(z.unknown()),
});

export const interpretedWorkflowSchema = z.object({
  goal: z.string(),
  steps: z.array(stepSchema),
});

export type InterpretedWorkflow = z.infer<typeof interpretedWorkflowSchema>;

const OPENAI_WORKFLOW_SCHEMA = {
  type: "object",
  properties: {
    goal: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["salesforce_create_lead", "microsoft_teams_message"] },
          input: { type: "object", additionalProperties: true },
        },
        required: ["type", "input"],
      },
    },
  },
  required: ["goal", "steps"],
} as const;

/**
 * Convert a user command into a structured workflow using OpenAI.
 * Throws if OPENAI_API_KEY is not set or API fails.
 */
export async function interpretCommand(command: string): Promise<InterpretedWorkflow> {
  const raw = await openai.generateStructuredOutput<{ goal: string; steps: Array<{ type: string; input: Record<string, unknown> }> }>({
    prompt: `Convert this user command into a workflow. Output JSON only with "goal" (short summary) and "steps" (ordered array). Each step must have "type" (exactly one of: salesforce_create_lead, microsoft_teams_message) and "input" (object). For salesforce_create_lead use input like { "FirstName": "John", "LastName": "Smith", "Company": "Acme Inc" }. For microsoft_teams_message use { "channel": "sales", "message": "Your message here" }. Command: "${command}"`,
    systemPrompt: "You are a workflow interpreter. Output only valid JSON. For Salesforce leads always include FirstName, LastName, Company in input. For Teams use channel and message.",
    schema: OPENAI_WORKFLOW_SCHEMA as unknown as Record<string, unknown>,
    maxTokens: 1024,
  });

  const parsed = interpretedWorkflowSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`OpenAI output validation failed: ${parsed.error.message}`);
  }
  return parsed.data;
}
