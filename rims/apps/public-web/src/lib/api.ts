const BASE = process.env.RIMS_API_URL ?? 'http://localhost:3000';
const HOSTNAME = process.env.SITE_HOSTNAME ?? 'demo-rims.localhost';

export async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/api/v1/public/sites/current${path}`, {
      headers: { 'X-Site-Hostname': HOSTNAME },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json() as { data?: T } | T;
    // Unwrap the standard RIMS API envelope { data: ..., success: true }
    if (json && typeof json === 'object' && 'data' in json) {
      return (json as { data: T }).data;
    }
    return json as T;
  } catch {
    return null;
  }
}
