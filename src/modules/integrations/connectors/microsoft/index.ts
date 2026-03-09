/**
 * Microsoft Graph connector — Teams channel messages.
 * Set MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID,
 * MICROSOFT_TEAMS_TEAM_ID, MICROSOFT_TEAMS_CHANNEL_ID.
 */

export { getMicrosoftConfig } from "./config";
export { sendTeamsMessage, sendEmail } from "./client";
export { executeSendTeamsMessage, microsoftActions } from "./actions";
export type { SendTeamsMessageInput, SendTeamsMessageResult } from "./types";
