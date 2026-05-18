import type { EventStatus } from "@/features/events/api/events";

const statusClassMap: Record<EventStatus, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  planned: "bg-[#e9ebff] text-[#2E3191] border-[#cfd4ff]",
  ongoing: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
};

export function formatEventDate(value?: string): string {
  return value ? new Date(value).toLocaleDateString("fr-FR") : "—";
}

export function getEventStatusClass(status?: EventStatus): string {
  return status ? statusClassMap[status] : statusClassMap.planned;
}
