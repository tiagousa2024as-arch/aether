/**
 * Salesforce REST API client — server-side only.
 * Create Lead and token handling (OAuth2 username-password or direct token).
 */

import { getSalesforceConfig } from "./config";

const TOKEN_URL = "https://login.salesforce.com/services/oauth2/token";
const API_VERSION = "v59.0";

let cachedToken: { access_token: string; instance_url: string } | null = null;

async function getAccessToken(): Promise<{ access_token: string; instance_url: string }> {
  const config = getSalesforceConfig();
  if (!config) throw new Error("Salesforce not configured. Set SALESFORCE_ACCESS_TOKEN + SALESFORCE_INSTANCE_URL or OAuth2 env vars.");

  if (config.accessToken && config.instanceUrl) {
    return { access_token: config.accessToken, instance_url: config.instanceUrl.replace(/\/$/, "") };
  }

  if (config.username && config.password && config.clientId && config.clientSecret) {
    const body = new URLSearchParams({
      grant_type: "password",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      username: config.username,
      password: config.password,
    });
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Salesforce token failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as { access_token: string; instance_url: string };
    return { access_token: data.access_token, instance_url: data.instance_url.replace(/\/$/, "") };
  }

  throw new Error("Salesforce not configured. Set SALESFORCE_ACCESS_TOKEN + SALESFORCE_INSTANCE_URL or OAuth2 env vars.");
}

async function getToken(): Promise<{ access_token: string; instance_url: string }> {
  if (cachedToken) return cachedToken;
  cachedToken = await getAccessToken();
  return cachedToken;
}

/**
 * Create a Lead in Salesforce.
 * Uses FirstName, LastName, Company (and optional Email) from input.
 */
export async function createLead(input: {
  FirstName?: string;
  LastName?: string;
  Company?: string;
  Email?: string;
  [key: string]: unknown;
}): Promise<{ id: string; success: boolean }> {
  const { access_token, instance_url } = await getToken();
  const url = `${instance_url}/services/data/${API_VERSION}/sobjects/Lead`;
  const body: Record<string, unknown> = {};
  if (input.FirstName != null) body.FirstName = input.FirstName;
  if (input.LastName != null) body.LastName = input.LastName;
  if (input.Company != null) body.Company = input.Company;
  if (input.Email != null) body.Email = input.Email;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as { id?: string; success?: boolean; errors?: Array<{ message: string }> };
  if (!res.ok) {
    const errors = data.errors?.map((e) => e.message).join("; ") ?? res.statusText;
    throw new Error(`Salesforce create lead failed: ${errors}`);
  }
  return { id: data.id ?? "", success: data.success !== false };
}

/**
 * Create a Contact in Salesforce.
 */
export async function createContact(input: {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
  AccountId?: string;
  [key: string]: unknown;
}): Promise<{ id: string; success: boolean }> {
  const { access_token, instance_url } = await getToken();
  const url = `${instance_url}/services/data/${API_VERSION}/sobjects/Contact`;
  const body: Record<string, unknown> = {};
  if (input.FirstName != null) body.FirstName = input.FirstName;
  if (input.LastName != null) body.LastName = input.LastName;
  if (input.Email != null) body.Email = input.Email;
  if (input.Phone != null) body.Phone = input.Phone;
  if (input.AccountId != null) body.AccountId = input.AccountId;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as { id?: string; success?: boolean; errors?: Array<{ message: string }> };
  if (!res.ok) {
    const errors = data.errors?.map((e) => e.message).join("; ") ?? res.statusText;
    throw new Error(`Salesforce create contact failed: ${errors}`);
  }
  return { id: data.id ?? "", success: data.success !== false };
}
