/**
 * ServiceNow connector — create and update incidents.
 * Set SERVICENOW_INSTANCE, SERVICENOW_USERNAME, SERVICENOW_PASSWORD.
 */

export { getServiceNowConfig } from "./config";
export { createIncident, updateIncident } from "./client";
export type { CreateIncidentInput, IncidentResult } from "./client";
