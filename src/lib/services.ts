// lib/services.ts
import { SERVICES, Service } from "@/lib/constants/services";

export function getServices(context?: string) {
  const formattedContext = context?.toLowerCase();

  if (formattedContext === "invoices") {
    return SERVICES.map(({ id, name , description }) => ({ id, name , description }));
  }

  return SERVICES.map(({ id, name, description, iconKey }) => ({
    id,
    name,
    description,
    iconKey,
  }));
}