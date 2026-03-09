/**
 * Salesforce connector — real REST API for Lead creation.
 * Set SALESFORCE_ACCESS_TOKEN + SALESFORCE_INSTANCE_URL or OAuth2 env vars.
 */

export { getSalesforceConfig } from "./config";
export { createLead, createContact } from "./client";
export { executeCreateLead, salesforceActions } from "./actions";
export type { CreateLeadInput, CreateLeadResult } from "./types";
