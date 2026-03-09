/**
 * Salesforce connector configuration.
 * Token auth: SALESFORCE_ACCESS_TOKEN + SALESFORCE_INSTANCE_URL
 * OAuth2 (username-password): SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_USERNAME, SALESFORCE_PASSWORD, SALESFORCE_INSTANCE_URL (optional, from token response)
 */

export function getSalesforceConfig(): {
  clientId: string;
  clientSecret: string;
  instanceUrl?: string;
  username?: string;
  password?: string;
  accessToken?: string;
} | null {
  const clientId = process.env.SALESFORCE_CLIENT_ID?.trim();
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET?.trim();
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL?.trim();
  const username = process.env.SALESFORCE_USERNAME?.trim();
  const password = process.env.SALESFORCE_PASSWORD?.trim();
  const accessToken = process.env.SALESFORCE_ACCESS_TOKEN?.trim();

  // Direct token: need at least instance URL and token
  if (accessToken && instanceUrl) {
    return {
      clientId: clientId ?? "",
      clientSecret: clientSecret ?? "",
      instanceUrl,
      accessToken,
    };
  }

  // Username-password flow
  if (clientId && clientSecret && username && password) {
    return {
      clientId,
      clientSecret,
      instanceUrl: instanceUrl ?? undefined,
      username,
      password,
    };
  }

  return null;
}
