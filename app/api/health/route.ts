/**
 * Health check - GET /api/health.
 * For Vercel monitoring and load balancers; returns 200 when app is up.
 */

export async function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
