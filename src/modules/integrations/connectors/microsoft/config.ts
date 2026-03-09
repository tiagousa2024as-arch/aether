/**
 * Microsoft Graph connector configuration.
 * OAuth2 client credentials: MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID.
 * Teams: MICROSOFT_TEAMS_TEAM_ID, MICROSOFT_TEAMS_CHANNEL_ID (optional; can be overridden per request).
 */

export function getMicrosoftConfig(): {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  teamsTeamId?: string;
  teamsChannelId?: string;
} | null {
  const clientId = process.env.MICROSOFT_CLIENT_ID?.trim();
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET?.trim();
  const tenantId = process.env.MICROSOFT_TENANT_ID?.trim();
  const teamsTeamId = process.env.MICROSOFT_TEAMS_TEAM_ID?.trim();
  const teamsChannelId = process.env.MICROSOFT_TEAMS_CHANNEL_ID?.trim();
  if (!clientId || !clientSecret || !tenantId) return null;
  return {
    clientId,
    clientSecret,
    tenantId,
    teamsTeamId: teamsTeamId || undefined,
    teamsChannelId: teamsChannelId || undefined,
  };
}
