export type PublicEvent = {
  _id: string;
  name: string;
  date: string;
  type?: string;
};

type ParticipatePayload = {
  email: string;
  name?: string;
};

type ApiError = Error & {
  status?: number;
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

export async function fetchEventParticipantsCount(eventId: string): Promise<number> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/events/${eventId}/participants-count`);
  if (!response.ok) {
    throw new Error("Failed to fetch participants count");
  }

  const data = (await response.json()) as { participantsCount?: number };
  return typeof data.participantsCount === "number" ? data.participantsCount : 0;
}

export async function participateInEvent(
  eventId: string,
  payload: ParticipatePayload
): Promise<void> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/events/${eventId}/participate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Une erreur est survenue.";
    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) {
        message = data.message;
      }
    } catch {
      // Keep generic message when response body is not JSON.
    }

    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }
}
