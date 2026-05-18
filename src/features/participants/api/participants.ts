import api from "@/lib/api";

export type DashboardParticipantItem = {
  participantId: string;
  name: string;
  email: string;
  eventId: string;
  eventTitle: string;
  projectId: string;
  projectName: string;
  service: string;
  participatedAt: string;
};

export type DashboardParticipantsStats = {
  totalParticipants: number;
  totalParticipatingEvents: number;
  mostActiveEvent?: {
    eventId: string;
    eventTitle: string;
    participations: number;
  } | null;
  mostActiveProject?: {
    projectId: string;
    projectName: string;
    participations: number;
  } | null;
};

export type DashboardParticipantsQuery = {
  projectId?: string;
  eventId?: string;
  q?: string;
};

export type DashboardParticipantsResponse = {
  message?: string;
  participants: DashboardParticipantItem[];
  stats: DashboardParticipantsStats;
};

type DashboardParticipantsPayload = {
  participants?: DashboardParticipantItem[];
  stats?: DashboardParticipantsStats;
  data?: {
    participants?: DashboardParticipantItem[];
    stats?: DashboardParticipantsStats;
  };
  message?: string;
};

function normalizeParticipant(raw: unknown): DashboardParticipantItem {
  const maybe = raw as Partial<DashboardParticipantItem>;

  return {
    participantId: maybe.participantId || "",
    name: maybe.name || "",
    email: maybe.email || "",
    eventId: maybe.eventId || "",
    eventTitle: maybe.eventTitle || "",
    projectId: maybe.projectId || "",
    projectName: maybe.projectName || "",
    service: maybe.service || "",
    participatedAt: maybe.participatedAt || "",
  };
}

function extractParticipants(data: unknown): DashboardParticipantItem[] {
  if (Array.isArray(data)) {
    return data.map(normalizeParticipant);
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const maybe = data as DashboardParticipantsPayload;
  if (Array.isArray(maybe.participants)) {
    return maybe.participants.map(normalizeParticipant);
  }
  if (Array.isArray(maybe.data?.participants)) {
    return maybe.data.participants.map(normalizeParticipant);
  }

  return [];
}

function extractStats(data: unknown): DashboardParticipantsStats {
  const emptyStats: DashboardParticipantsStats = {
    totalParticipants: 0,
    totalParticipatingEvents: 0,
    mostActiveEvent: null,
    mostActiveProject: null,
  };

  if (!data || typeof data !== "object") {
    return emptyStats;
  }

  const maybe = data as DashboardParticipantsPayload;
  return {
    ...emptyStats,
    ...(maybe.stats || {}),
    ...(maybe.data?.stats || {}),
  };
}

export async function getDashboardParticipants(
  params: DashboardParticipantsQuery = {}
): Promise<DashboardParticipantsResponse> {
  const res = await api.get("/dashboard/participants", { params });

  return {
    message:
      (res.data && typeof res.data === "object" && "message" in res.data
        ? (res.data as { message?: string }).message
        : undefined) || undefined,
    participants: extractParticipants(res.data),
    stats: extractStats(res.data),
  };
}
