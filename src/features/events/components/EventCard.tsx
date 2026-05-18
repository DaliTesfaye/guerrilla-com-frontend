import Link from "next/link";
import type { EventItem } from "@/features/events/api/events";
import EventStatusBadge from "@/features/events/components/EventStatusBadge";
import { formatEventDate } from "@/features/events/utils/eventDisplay";

type EventCardProps = {
  event: EventItem;
  canManage?: boolean;
  detailsHref?: string;
  editHref?: string;
  onDelete?: () => void;
  deleting?: boolean;
  className?: string;
};

export default function EventCard({
  event,
  canManage,
  detailsHref,
  editHref,
  onDelete,
  deleting = false,
  className = "",
}: EventCardProps) {
  return (
    <article
      className={`rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#2E3191]/25 hover:shadow-md ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            {event.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-gray-900">{event.title}</p>
                <p className="mt-1 text-xs text-gray-600">
                  {formatEventDate(event.date)} • {event.service}
                </p>
              </div>
              <EventStatusBadge status={event.status} />
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {event.city} • {event.location}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              👥 {event.participantsCount ?? 0} participants
              {event.hasGame ? " • 🎮 Game" : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {detailsHref && (
            <Link href={detailsHref} className="text-xs font-medium text-[#2E3191] hover:underline">
              Details
            </Link>
          )}
          {canManage && editHref && (
            <Link href={editHref} className="text-xs font-medium text-gray-700 hover:underline">
              Modifier
            </Link>
          )}
          {canManage && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="text-xs font-medium text-[#C7072C] hover:underline disabled:opacity-60"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
