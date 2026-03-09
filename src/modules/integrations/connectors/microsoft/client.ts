/**
 * Microsoft Graph API client — server-side only.
 * OAuth2 client credentials; send Teams channel message.
 */

import { getMicrosoftConfig } from "./config";

let cachedToken: string | null = null;

async function getAccessToken(): Promise<string> {
  const config = getMicrosoftConfig();
  if (!config) throw new Error("Microsoft not configured. Set MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID.");

  if (cachedToken) return cachedToken;a pasta errada	Nesse terminal o dev não inicia; você pode estar vendo outra aba/outro servidor onde o código j

  const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: "https://graph.microsoft.com/.default",
  });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Microsoft token failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { access_token: string };
  cachedToken = data.access_token;
  return cachedToken;
}

/**
 * Send a message to a Teams channel.
 * Uses MICROSOFT_TEAMS_TEAM_ID and MICROSOFT_TEAMS_CHANNEL_ID from env if channel/channelId not provided.
 */
export async function sendTeamsMessage(params: {
  message: string;
  teamId?: string;
  channelId?: string;
}): Promise<{ id: string; createdDateTime: string }> {
  const config = getMicrosoftConfig();
  if (!config) throw new Error("Microsoft not configured.");

  const teamId = params.teamId ?? config.teamsTeamId;
  const channelId = params.channelId ?? config.teamsChannelId;
  if (!teamId || !channelId) {
    throw new Error("Teams channel not configured. Set MICROSOFT_TEAMS_TEAM_ID and MICROSOFT_TEAMS_CHANNEL_ID, or pass teamId and channelId.");
  }

  const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: {
        content: params.message,
        contentType: "text",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Microsoft Teams send message failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { id: string; createdDateTime: string };
  return { id: data.id, createdDateTime: data.createdDateTime ?? new Date().toISOString() };
}

/**
 * Send an email via Microsoft Graph (Outlook).
 * Requires Mail.Send application permission and MICROSOFT_EMAIL_USER_ID (user or shared mailbox to send as).
 */
export async function sendEmail(params: {
  to: string[];
  subject: string;
  body: string;
  bodyType?: "text" | "html";
  userId?: string;
}): Promise<{ success: boolean }> {
  const config = getMicrosoftConfig();
  if (!config) throw new Error("Microsoft not configured.");
  const userId = params.userId ?? process.env.MICROSOFT_EMAIL_USER_ID;
  if (!userId) throw new Error("MICROSOFT_EMAIL_USER_ID required for sendEmail, or pass userId.");
  const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/users/${userId}/sendMail`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject: params.subject,
        body: {
          contentType: params.bodyType === "html" ? "HTML" : "Text",
          content: params.body,
        },
        toRecipients: params.to.map((email) => ({
          emailAddress: { address: email },
        })),
      },
    }),
  });
  return { success: true };
}

export { getMicrosoftConfig };
