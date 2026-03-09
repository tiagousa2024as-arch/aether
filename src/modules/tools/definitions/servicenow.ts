/**
 * ServiceNow tools — create_incident, update_incident.
 * Allowed agents: support_agent.
 */

import { z } from "zod";
import { registerTool } from "../registry";
import type { AetherTool } from "../types";
import * as servicenow from "@/modules/integrations/connectors/servicenow/client";

const createIncidentInput = z.object({
  short_description: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  urgency: z.number().optional(),
  impact: z.number().optional(),
  caller_id: z.string().optional(),
});

const updateIncidentInput = z.object({
  sys_id: z.string().min(1),
  short_description: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  urgency: z.number().optional(),
  impact: z.number().optional(),
  state: z.number().optional(),
});

export const servicenowCreateIncident: AetherTool<
  z.infer<typeof createIncidentInput>,
  { sys_id: string; number: string }
> = {
  name: "servicenow.create_incident",
  description: "Create an incident in ServiceNow.",
  connector: "servicenow",
  allowedAgents: ["support_agent"],
  inputSchema: createIncidentInput,
  async execute(input, _context) {
    return servicenow.createIncident(input);
  },
};

export const servicenowUpdateIncident: AetherTool<
  z.infer<typeof updateIncidentInput>,
  { sys_id: string }
> = {
  name: "servicenow.update_incident",
  description: "Update an existing incident in ServiceNow.",
  connector: "servicenow",
  allowedAgents: ["support_agent"],
  inputSchema: updateIncidentInput,
  async execute(input, _context) {
    const { sys_id, ...rest } = input;
    return servicenow.updateIncident(sys_id, rest);
  },
};

export function registerServiceNowTools(): void {
  registerTool(servicenowCreateIncident);
  registerTool(servicenowUpdateIncident);
}
