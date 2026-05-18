"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BriefcaseBusiness, CalendarRange, Users, UserRoundSearch } from "lucide-react";
import axios from "axios";
import { getDashboardProjects, type DashboardProject } from "@/features/projects/api/projects";
import { getEvents, type EventItem } from "@/features/events/api/events";
import {
  getDashboardParticipants,
  type DashboardParticipantItem,
  type DashboardParticipantsStats,
} from "@/features/participants/api/participants";
import { useAuthStore } from "@/store/authStore";

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}

function formatParticipationDate(value?: string): string {
  return value
    ? new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: JSX.Element;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <span className="rounded-lg bg-[#e9ebff] p-2 text-[#2E3191]">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#2E3191]">{value}</p>
    </article>
  );
}

export default function ParticipantsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");
  const accessDenied = !!user && !canManage;

  const [participants, setParticipants] = useState<DashboardParticipantItem[]>([]);
  const [stats, setStats] = useState<DashboardParticipantsStats>({
    totalParticipants: 0,
    totalParticipatingEvents: 0,
    mostActiveEvent: null,
    mostActiveProject: null,
  });
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectFilter, setProjectFilter] = useState(searchParams.get("projectId") || "");
  const [eventFilter, setEventFilter] = useState(searchParams.get("eventId") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => {
    if (user && !canManage) {
      router.replace("/dashboard/home");
    }
  }, [canManage, router, user]);

  useEffect(() => {
    setProjectFilter(searchParams.get("projectId") || "");
    setEventFilter(searchParams.get("eventId") || "");
    setSearchInput(searchParams.get("q") || "");
  }, [searchParams]);

  const syncUrl = useCallback(
    (nextProjectId: string, nextEventId: string, nextSearch: string) => {
      const params = new URLSearchParams();

      if (nextProjectId) {
        params.set("projectId", nextProjectId);
      }
      if (nextEventId) {
        params.set("eventId", nextEventId);
      }
      if (nextSearch.trim()) {
        params.set("q", nextSearch.trim());
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    syncUrl(projectFilter, eventFilter, debouncedSearch);
  }, [debouncedSearch, eventFilter, projectFilter, syncUrl]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [projectsList, eventsList] = await Promise.all([getDashboardProjects(), getEvents()]);
        setProjects(projectsList);
        setEvents(eventsList);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Impossible de charger les filtres.");
        } else {
          setError("Impossible de charger les filtres.");
        }
      } finally {
        setFiltersLoading(false);
      }
    };

    loadFilters();
  }, []);

  const loadParticipants = useCallback(
    async (projectId?: string, eventId?: string, q?: string) => {
      setLoading(true);
      setError("");

      try {
        const response = await getDashboardParticipants({
          projectId: projectId || undefined,
          eventId: eventId || undefined,
          q: q?.trim() || undefined,
        });

        setParticipants(response.participants);
        setStats(response.stats);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 403) {
            setError(err.response?.data?.message || "Acces interdit.");
          } else if (status === 401) {
            setError("Authentification requise.");
          } else {
            setError(err.response?.data?.message || "Impossible de charger les participants.");
          }
        } else {
          setError("Impossible de charger les participants.");
        }
        setParticipants([]);
        setStats({
          totalParticipants: 0,
          totalParticipatingEvents: 0,
          mostActiveEvent: null,
          mostActiveProject: null,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadParticipants(projectFilter, eventFilter, debouncedSearch);
  }, [debouncedSearch, eventFilter, loadParticipants, projectFilter]);

  const projectOptions = useMemo(() => projects, [projects]);
  const eventOptions = useMemo(() => events, [events]);

  if (accessDenied) {
    return <div className="text-sm text-gray-500">Acces non autorise.</div>;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <Users size={22} className="text-[#2E3191]" />
            Participants
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue centralisée des participations aux événements.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[720px]">
          <div className="space-y-1.5">
            <label htmlFor="participant-search" className="text-xs font-medium text-gray-600">
              Rechercher
            </label>
            <input
              id="participant-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nom ou email"
              className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="project-filter" className="text-xs font-medium text-gray-600">
              Projet
            </label>
            <select
              id="project-filter"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              disabled={filtersLoading}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191] disabled:bg-gray-50"
            >
              <option value="">Tous les projets</option>
              {projectOptions.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="event-filter" className="text-xs font-medium text-gray-600">
              Evenement
            </label>
            <select
              id="event-filter"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              disabled={filtersLoading}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191] disabled:bg-gray-50"
            >
              <option value="">Tous les evenements</option>
              {eventOptions.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total participants" value={stats.totalParticipants} icon={<Users size={16} />} />
        <StatCard
          label="Total participating events"
          value={stats.totalParticipatingEvents}
          icon={<CalendarRange size={16} />}
        />
        <StatCard
          label="Most active event"
          value={stats.mostActiveEvent ? stats.mostActiveEvent.eventTitle : "—"}
          icon={<UserRoundSearch size={16} />}
        />
        <StatCard
          label="Most active project"
          value={stats.mostActiveProject ? stats.mostActiveProject.projectName : "—"}
          icon={<BriefcaseBusiness size={16} />}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Liste des participants</h2>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-sm text-gray-500">Chargement des participants...</div>
        ) : participants.length === 0 ? (
          <div className="px-5 py-10 text-sm text-gray-500">Aucun participant trouve.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Event title
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Project name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Service
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Participation date/time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {participants.map((participant) => (
                  <tr key={participant.participantId} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{participant.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{participant.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{participant.eventTitle}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{participant.projectName}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{participant.service}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatParticipationDate(participant.participatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
