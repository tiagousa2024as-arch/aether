/**
 * AETHER command interpretation types.
 * Output of LLM: natural language → structured workflow.
 */

export const WORKFLOW_STEP_TYPES = ["salesforce_create_lead", "microsoft_teams_message"] as const;
export type WorkflowStepType = (typeof WORKFLOW_STEP_TYPES)[number];

export interface InterpretedStep {
  type: WorkflowStepType;
  input: Record<string, unknown>;
}

export interface InterpretedWorkflow {
  goal: string;
  steps: InterpretedStep[];
}
