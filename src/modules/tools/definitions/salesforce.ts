/**
 * Salesforce tools — create_lead, create_contact.
 * Allowed agents: sales_agent.
 */

import { z } from "zod";
import { registerTool } from "../registry";
import type { AetherTool } from "../types";
import * as salesforce from "@/modules/integrations/connectors/salesforce/client";

const createLeadInput = z.object({
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  Company: z.string().optional(),
  Email: z.string().email().optional(),
});

const createContactInput = z.object({
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  Email: z.string().email().optional(),
  Phone: z.string().optional(),
  AccountId: z.string().optional(),
});

export const salesforceCreateLead: AetherTool<
  z.infer<typeof createLeadInput>,
  { id: string; success: boolean }
> = {
  name: "salesforce.create_lead",
  description: "Create a Lead in Salesforce.",
  connector: "salesforce",
  allowedAgents: ["sales_agent", "workflow_agent"],
  inputSchema: createLeadInput,
  async execute(input, _context) {
    return salesforce.createLead(input);
  },
};

export const salesforceCreateContact: AetherTool<
  z.infer<typeof createContactInput>,
  { id: string; success: boolean }
> = {
  name: "salesforce.create_contact",
  description: "Create a Contact in Salesforce.",
  connector: "salesforce",
  allowedAgents: ["sales_agent", "workflow_agent"],
  inputSchema: createContactInput,
  async execute(input, _context) {
    return salesforce.createContact(input);
  },
};

export function registerSalesforceTools(): void {
  registerTool(salesforceCreateLead);
  registerTool(salesforceCreateContact);
}
