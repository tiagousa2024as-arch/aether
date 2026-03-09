/**
 * Microsoft tools — teams.send_message, outlook.send_email.
 * Allowed agents: operations_agent.
 */

import { z } from "zod";
import { registerTool } from "../registry";
import type { AetherTool } from "../types";
import * as microsoft from "@/modules/integrations/connectors/microsoft/client";

const teamsSendMessageInput = z.object({
  message: z.string().min(1),
  channelId: z.string().optional(),
  teamId: z.string().optional(),
});

const outlookSendEmailInput = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  bodyType: z.enum(["text", "html"]).optional(),
  userId: z.string().optional(),
});

export const microsoftTeamsSendMessage: AetherTool<
  z.infer<typeof teamsSendMessageInput>,
  { id: string; createdDateTime: string }
> = {
  name: "microsoft.teams.send_message",
  description: "Send a message to a Microsoft Teams channel.",
  connector: "microsoft",
  allowedAgents: ["operations_agent", "workflow_agent"],
  inputSchema: teamsSendMessageInput,
  async execute(input, _context) {
    return microsoft.sendTeamsMessage({
      message: input.message,
      channelId: input.channelId,
      teamId: input.teamId,
    });
  },
};

export const microsoftOutlookSendEmail: AetherTool<
  z.infer<typeof outlookSendEmailInput>,
  { success: boolean }
> = {
  name: "microsoft.outlook.send_email",
  description: "Send an email via Microsoft Outlook (Graph API).",
  connector: "microsoft",
  allowedAgents: ["operations_agent", "workflow_agent"],
  inputSchema: outlookSendEmailInput,
  async execute(input, _context) {
    return microsoft.sendEmail({
      to: input.to,
      subject: input.subject,
      body: input.body,
      bodyType: input.bodyType,
      userId: input.userId,
    });
  },
};

export function registerMicrosoftTools(): void {
  registerTool(microsoftTeamsSendMessage);
  registerTool(microsoftOutlookSendEmail);
}
