import api from "@/lib/api";

export type ProjectStatus = "planned" | "active" | "completed";

export type DashboardProject = {
  _id: string;
  name: string;
  description: string;
  clientName: string;
  budget?: number;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRelatedEvent = {
  _id: string;
  name: string;
  date?: string;
  type?: string;
  service?: string;
  city?: string;
  participantsCount?: number;
  status?: string;
  hasGame?: boolean;
};

export type DashboardProjectDetails = {
  project: DashboardProject;
  relatedEvents: ProjectRelatedEvent[];
};

export type CreateDashboardProjectPayload = {
  name: string;
  description: string;
  clientName: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget?: number;
  image?: string;
};

export type UpdateDashboardProjectPayload = Partial<CreateDashboardProjectPayload>;

type ProjectsListResponse = {
  projects?: DashboardProject[];
  data?: DashboardProject[];
};

type ProjectItemResponse = {
  project?: DashboardProject;
  data?: DashboardProject;
  events?: ProjectRelatedEvent[];
  relatedEvents?: ProjectRelatedEvent[];
};

type ProjectDetailsResponse = {
  project?: DashboardProject & {
    events?: ProjectRelatedEvent[];
    relatedEvents?: ProjectRelatedEvent[];
  };
  data?: DashboardProject & {
    events?: ProjectRelatedEvent[];
    relatedEvents?: ProjectRelatedEvent[];
  };
  events?: ProjectRelatedEvent[];
  relatedEvents?: ProjectRelatedEvent[];
};

function extractProjects(data: unknown): DashboardProject[] {
  if (Array.isArray(data)) {
    return data as DashboardProject[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const maybe = data as ProjectsListResponse;
  if (Array.isArray(maybe.projects)) {
    return maybe.projects;
  }
  if (Array.isArray(maybe.data)) {
    return maybe.data;
  }

  return [];
}

function extractProject(data: unknown): DashboardProject {
  if (data && typeof data === "object" && "_id" in data) {
    return data as DashboardProject;
  }

  const maybe = (data || {}) as ProjectItemResponse;
  if (maybe.project) {
    return maybe.project;
  }
  if (maybe.data) {
    return maybe.data;
  }

  throw new Error("Invalid project response");
}

function extractRelatedEvents(data: unknown): ProjectRelatedEvent[] {
  if (!data || typeof data !== "object") {
    return [];
  }

  const maybe = data as ProjectDetailsResponse;
  if (Array.isArray(maybe.relatedEvents)) {
    return maybe.relatedEvents;
  }
  if (Array.isArray(maybe.events)) {
    return maybe.events;
  }
  if (maybe.project?.relatedEvents && Array.isArray(maybe.project.relatedEvents)) {
    return maybe.project.relatedEvents;
  }
  if (maybe.project?.events && Array.isArray(maybe.project.events)) {
    return maybe.project.events;
  }
  if (maybe.data?.relatedEvents && Array.isArray(maybe.data.relatedEvents)) {
    return maybe.data.relatedEvents;
  }
  if (maybe.data?.events && Array.isArray(maybe.data.events)) {
    return maybe.data.events;
  }

  return [];
}

export async function getDashboardProjects(): Promise<DashboardProject[]> {
  const res = await api.get("/projects");
  return extractProjects(res.data);
}

export async function getDashboardProjectById(id: string): Promise<DashboardProject> {
  const res = await api.get(`/projects/${id}`);
  return extractProject(res.data);
}

export async function getDashboardProjectDetails(id: string): Promise<DashboardProjectDetails> {
  const res = await api.get(`/projects/${id}`);
  return {
    project: extractProject(res.data),
    relatedEvents: extractRelatedEvents(res.data),
  };
}

export async function createDashboardProject(
  payload: CreateDashboardProjectPayload
): Promise<DashboardProject> {
  const res = await api.post("/projects", payload);
  return extractProject(res.data);
}

export async function updateDashboardProject(
  id: string,
  payload: UpdateDashboardProjectPayload
): Promise<DashboardProject> {
  const res = await api.patch(`/projects/${id}`, payload);
  return extractProject(res.data);
}

export async function deleteDashboardProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}

export async function createProjectEvent<TPayload extends object>(
  projectId: string,
  payload: TPayload
): Promise<unknown> {
  const res = await api.post(`/projects/${projectId}/events`, payload);
  return res.data;
}

export type PublicProject = {
  _id: string;
  name: string;
  description?: string;
  status: string;
};

export async function fetchPublicProjects(): Promise<PublicProject[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data: unknown = await response.json();
  return Array.isArray(data) ? (data as PublicProject[]) : [];
}

export async function fetchPublicProjectDetails(id: string): Promise<DashboardProjectDetails> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/projects/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch project details");
  }

  const data: unknown = await response.json();
  return {
    project: extractProject(data),
    relatedEvents: extractRelatedEvents(data),
  };
}
