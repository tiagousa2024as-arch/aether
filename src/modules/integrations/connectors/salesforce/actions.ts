/**
 * Salesforce connector actions — createLead and metadata for integration framework.
 */

import { z } from "zod";
import * as client from "./client";

const createLeadInputSchema = z.object({
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  Company: z.string().optional(),
  Email: z.string().email().optional(),
});

export async function executeCreateLead(input: unknown): Promise<{ id: string; success: boolean }> {
  const parsed = createLeadInputSchema.safeParse(input);
  if (!parsed.success) throw new Error(`Invalid createLead input: ${parsed.error.message}`);
  return client.createLead(parsed.data);
}

export const salesforceActions = {
  createLead: executeCreateLead,
};
