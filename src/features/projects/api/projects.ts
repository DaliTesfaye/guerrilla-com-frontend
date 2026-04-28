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
