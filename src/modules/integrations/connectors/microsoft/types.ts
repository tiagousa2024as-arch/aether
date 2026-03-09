/**
 * Microsoft Graph connector types.
 */

export interface SendTeamsMessageInput {
  channel?: string;  // channel id or channel name (if env has team id we can resolve by name)
  channelId?: string;
  message: string;
}

export interface SendTeamsMessageResult {
  id: string;
  createdDateTime: string;
}
