export type PublicEvent = {
  _id: string;
  name: string;
  date: string;
  type?: string;
};

export async function fetchPublicEvents(): Promise<PublicEvent[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data: unknown = await response.json();
  return Array.isArray(data) ? (data as PublicEvent[]) : [];
}
