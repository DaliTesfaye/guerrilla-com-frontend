export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  iconKey?: string;
};

type ServicesResponse = {
  services?: ServiceItem[];
};

export async function fetchServices(): Promise<ServiceItem[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/services`);
  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const data: unknown = await response.json();
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as ServicesResponse).services)
  ) {
    return (data as ServicesResponse).services as ServiceItem[];
  }

  return [];
}
