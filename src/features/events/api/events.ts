import api from "@/lib/api";

export type EventStatus = "draft" | "planned" | "ongoing" | "completed";

export type EventItem = {
  _id: string;
  title: string;
  description?: string;
  service: string;
  projectId: string;
  status: EventStatus;
  date: string;
  city: string;
  location: string;
  image?: string;
  maxParticipants?: number;
  participantsCount?: number;
  hasGame: boolean;
  gameName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateEventPayload = {
  title: string;
  description?: string;
  service: string;
  projectId: string;
  status: EventStatus;
  date: string;
  city: string;
  location: string;
  image?: string;
  maxParticipants?: number;
  hasGame: boolean;
  gameName?: string;
};

export type UpdateEventPayload = Partial<CreateEventPayload>;

export type PublicEvent = {
  _id: string;
  title: string;
  name: string;
  projectId?: string;
  projectName?: string;
  date: string;
  service?: string;
  type?: string;
  city?: string;
  location?: string;
  status?: EventStatus;
  participantsCount?: number;
};

type ParticipatePayload = {
  email: string;
  name?: string;
};

type ApiError = Error & {
  status?: number;
};

type EventsListResponse = {
  events?: EventItem[];
  data?: EventItem[];
};

type EventItemResponse = {
  event?: EventItem;
  data?: EventItem;
};

function normalizeEvent(raw: unknown): EventItem {
  const maybe = (raw || {}) as Partial<EventItem> & {
    name?: string;
    type?: string;
    project?: { _id?: string };
  };

  return {
    _id: maybe._id || "",
    title: maybe.title || maybe.name || "",
    description: maybe.description || "",
    service: maybe.service || maybe.type || "",
    projectId:
      (typeof maybe.projectId === "string" ? maybe.projectId : undefined) ||
      maybe.project?._id ||
      "",
    status: (maybe.status as EventStatus) || "planned",
    date: maybe.date || "",
    city: maybe.city || "",
    location: maybe.location || "",
    image: maybe.image,
    maxParticipants: maybe.maxParticipants,
    participantsCount: maybe.participantsCount,
    hasGame: Boolean(maybe.hasGame),
    gameName: maybe.gameName,
    createdAt: maybe.createdAt,
    updatedAt: maybe.updatedAt,
  };
}

function extractEvents(data: unknown): EventItem[] {
  if (Array.isArray(data)) {
    return data.map(normalizeEvent);
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const maybe = data as EventsListResponse;
  if (Array.isArray(maybe.events)) {
    return maybe.events.map(normalizeEvent);
  }
  if (Array.isArray(maybe.data)) {
    return maybe.data.map(normalizeEvent);
  }

  return [];
}

function extractEvent(data: unknown): EventItem {
  if (data && typeof data === "object" && "_id" in data) {
    return normalizeEvent(data);
  }

  const maybe = (data || {}) as EventItemResponse;
  if (maybe.event) {
    return normalizeEvent(maybe.event);
  }
  if (maybe.data) {
    return normalizeEvent(maybe.data);
  }

  throw new Error("Invalid event response");
}

function mapToPublicEvent(event: EventItem): PublicEvent {
  return {
    _id: event._id,
    title: event.title,
    name: event.title,
    projectId: event.projectId,
    date: event.date,
    service: event.service,
    type: event.service,
    city: event.city,
    location: event.location,
    status: event.status,
    participantsCount: event.participantsCount,
  };
}

export async function getEvents(): Promise<EventItem[]> {
  const res = await api.get("/events");
  return extractEvents(res.data);
}

export async function getEventsByProjectId(projectId: string): Promise<EventItem[]> {
  const events = await getEvents();
  return events.filter((event) => event.projectId === projectId);
}

export async function getEventById(eventId: string): Promise<EventItem> {
  const res = await api.get(`/events/${eventId}`);
  return extractEvent(res.data);
}

export async function createEvent(payload: CreateEventPayload): Promise<EventItem> {
  const res = await api.post("/events", payload);
  return extractEvent(res.data);
}

export async function updateEvent(eventId: string, payload: UpdateEventPayload): Promise<EventItem> {
  const res = await api.patch(`/events/${eventId}`, payload);
  return extractEvent(res.data);
}

export async function deleteEvent(eventId: string): Promise<void> {
  await api.delete(`/events/${eventId}`);
}

export async function sendReminders(eventId: string): Promise<{ success?: boolean; sent?: number; failed?: number; message?: string }> {
  const res = await api.post(`/events/${eventId}/send-reminders`);
  return res.data;
}

export async function fetchPublicEvents(): Promise<PublicEvent[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data: unknown = await response.json();
  return extractEvents(data).map(mapToPublicEvent);
}

export async function fetchEventParticipantsCount(eventId: string): Promise<number> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/events/${eventId}/participants-count`);
  if (!response.ok) {
    throw new Error("Failed to fetch participants count");
  }

  const data = (await response.json()) as {
    participantsCount?: number;
    data?: { participantsCount?: number };
  };
  if (typeof data.participantsCount === "number") {
    return data.participantsCount;
  }
  if (typeof data.data?.participantsCount === "number") {
    return data.data.participantsCount;
  }

  return 0;
}

export async function fetchParticipantsCountByEventIds(
  eventIds: string[]
): Promise<Record<string, number>> {
  const entries = await Promise.all(
    eventIds.map(async (eventId) => {
      try {
        const count = await fetchEventParticipantsCount(eventId);
        return [eventId, count] as const;
      } catch {
        return [eventId, 0] as const;
      }
    })
  );

  return Object.fromEntries(entries);
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
