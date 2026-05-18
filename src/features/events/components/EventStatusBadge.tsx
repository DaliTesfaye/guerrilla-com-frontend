import type { EventStatus } from "@/features/events/api/events";
import { getEventStatusClass } from "@/features/events/utils/eventDisplay";

type EventStatusBadgeProps = {
  status?: EventStatus;
};

export default function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getEventStatusClass(status)}`}>
      {status || "planned"}
    </span>
  );
}
