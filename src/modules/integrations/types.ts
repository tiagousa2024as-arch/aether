/**
 * AETHER Integration Layer — Generic connector interface.
 * All external API connectors (OpenAI, Anthropic, Microsoft, Salesforce, ServiceNow)
 * implement this interface so agents can call them uniformly.
 */

/** Definition of an action a connector can execute (for discovery and validation). */
export interface ActionDefinition {
  id: string;
  name: string;
  description: string;
  /** JSON Schema or Zod schema name for input validation. */
  inputSchema?: Record<string, unknown>;
  /** Optional list of required input keys. */
  requiredInputs?: string[];
}

/** Result of executing an action (normalized across connectors). */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  /** Raw response for logging; omit sensitive fields. */
  meta?: Record<string, unknown>;
}

/**
 * Generic integration connector interface.
 * Connectors authenticate, expose actions, and execute them.
 * Used by agents and the workflow engine.
 */
export interface IntegrationConnector {
  /** Unique connector name (e.g. "openai", "salesforce"). */
  name: string;

  /** Ensure the connector is authenticated and ready. Throws if misconfigured. */
  authenticate(): Promise<void>;

  /** List all actions this connector can perform (for UI and workflow planning). */
  listActions(): ActionDefinition[];

  /**
   * Execute an action by id with validated input.
   * Input must match the action's schema; use Zod to validate before calling.
   */
  execute(actionId: string, input: Record<string, unknown>): Promise<ActionResult>;
}
