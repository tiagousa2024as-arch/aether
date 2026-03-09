/**
 * ServiceNow connector configuration — Phase 4.
 * Basic or OAuth: SERVICENOW_INSTANCE, SERVICENOW_USERNAME, SERVICENOW_PASSWORD.
 */

export function getServiceNowConfig(): { instance: string; username: string; password: string } | null {
  const instance = process.env.SERVICENOW_INSTANCE;
  const username = process.env.SERVICENOW_USERNAME;
  const password = process.env.SERVICENOW_PASSWORD;
  if (!instance?.trim() || !username?.trim() || !password?.trim()) return null;
  return { instance: instance.replace(/\/$/, ""), username, password };
}
