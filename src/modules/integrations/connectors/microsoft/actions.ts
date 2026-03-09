/**
 * Microsoft connector actions — sendTeamsMessage and metadata.
 */

import { z } from "zod";
import * as client from "./client";

const sendTeamsMessageInputSchema = z.object({
  channel: z.string().optional(),
  channelId: z.string().optional(),
  message: z.string().min(1),
});

export async function executeSendTeamsMessage(input: unknown): Promise<{ id: string; createdDateTime: string }> {
  const parsed = sendTeamsMessageInputSchema.safeParse(input);
  if (!parsed.success) throw new Error(`Invalid sendTeamsMessage input: ${parsed.error.message}`);
  return client.sendTeamsMessage({
    message: parsed.data.message,
    channelId: parsed.data.channelId ?? parsed.data.channel,
  });
}

export const microsoftActions = {
  sendTeamsMessage: executeSendTeamsMessage,
};
