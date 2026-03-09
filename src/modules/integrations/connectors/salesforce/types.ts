/**
 * Salesforce connector types.
 */

export interface CreateLeadInput {
  FirstName?: string;
  LastName?: string;
  Company?: string;
  Email?: string;
  [key: string]: unknown;
}

export interface CreateLeadResult {
  id: string;
  success: boolean;
  errors?: string[];
}
