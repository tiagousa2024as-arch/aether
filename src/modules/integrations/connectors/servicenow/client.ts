/**
 * ServiceNow REST API client — server-side only.
 * Create and update incidents (table incident).
 */

import { getServiceNowConfig } from "./config";

let _authHeader: string | null = null;

function getAuthHeader(): string {
  if (_authHeader) return _authHeader;
  const config = getServiceNowConfig();
  if (!config) throw new Error("ServiceNow not configured. Set SERVICENOW_INSTANCE, SERVICENOW_USERNAME, SERVICENOW_PASSWORD.");
  const encoded = Buffer.from(`${config.username}:${config.password}`).toString("base64");
  _authHeader = `Basic ${encoded}`;
  return _authHeader;
}

async function request<T>(method: string, path: string, body?: object): Promise<T> {
  const config = getServiceNowConfig();
  if (!config) throw new Error("ServiceNow not configured.");
  const url = `${config.instance}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ServiceNow API failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export interface CreateIncidentInput {
  short_description?: string;
  description?: string;
  category?: string;
  urgency?: number;
  impact?: number;
  caller_id?: string;
  [key: string]: unknown;
}

export interface IncidentResult {
  result: { sys_id: string; number: string; [key: string]: unknown };
}

export async function createIncident(input: CreateIncidentInput): Promise<{ sys_id: string; number: string }> {
  const body: Record<string, unknown> = {};
  if (input.short_description != null) body.short_description = input.short_description;
  if (input.description != null) body.description = input.description;
  if (input.category != null) body.category = input.category;
  if (input.urgency != null) body.urgency = input.urgency;
  if (input.impact != null) body.impact = input.impact;
  if (input.caller_id != null) body.caller_id = input.caller_id;
  const data = await request<IncidentResult>("POST", "/api/now/table/incident", body);
  return {
    sys_id: data.result.sys_id,
    number: data.result.number ?? data.result.sys_id,
  };
}

export async function updateIncident(
  sysId: string,
  input: Partial<CreateIncidentInput> & { state?: number }
): Promise<{ sys_id: string }> {
  const body: Record<string, unknown> = {};
  if (input.short_description != null) body.short_description = input.short_description;
  if (input.description != null) body.description = input.description;
  if (input.category != null) body.category = input.category;
  if (input.urgency != null) body.urgency = input.urgency;
  if (input.impact != null) body.impact = input.impact;
  if (input.state != null) body.state = input.state;
  await request("PATCH", `/api/now/table/incident/${sysId}`, body);
  return { sys_id: sysId };
}
