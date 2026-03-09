/**
 * Tool definitions — register all AETHER tools at startup.
 * Agent → Tool Executor → Registry → Tool → Connector
 */

import { registerOpenAITools } from "./openai";
import { registerAnthropicTools } from "./anthropic";
import { registerSalesforceTools } from "./salesforce";
import { registerMicrosoftTools } from "./microsoft";
import { registerServiceNowTools } from "./servicenow";

let registered = false;

export function registerAllTools(): void {
  if (registered) return;
  registerOpenAITools();
  registerAnthropicTools();
  registerSalesforceTools();
  registerMicrosoftTools();
  registerServiceNowTools();
  registered = true;
}

export { registerOpenAITools } from "./openai";
export { registerAnthropicTools } from "./anthropic";
export { registerSalesforceTools } from "./salesforce";
export { registerMicrosoftTools } from "./microsoft";
export { registerServiceNowTools } from "./servicenow";
