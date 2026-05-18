"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FolderKanban, Layers3 } from "lucide-react";
import axios from "axios";
import api from "@/lib/api";
import { fetchParticipantsCountByEventIds, type EventItem } from "@/features/events/api/events";

type Project = {
  _id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
};

export default function DashboardHomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [participantsCountByEvent, setParticipantsCountByEvent] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setError("");
      try {
        const [projectsRes, eventsRes] = await Promise.all([api.get("/projects"), api.get("/events")]);

        const projectsList = Array.isArray(projectsRes.data) ? (projectsRes.data as Project[]) : [];
        const eventsList = Array.isArray(eventsRes.data)
          ? (eventsRes.data as EventItem[])
          : Array.isArray(eventsRes.data?.events)
            ? (eventsRes.data.events as EventItem[])
            : [];

        setProjects(projectsList);
        setEvents(eventsList);

        const participantsMap = await fetchParticipantsCountByEventIds(
          eventsList.map((event) => event._id)
        );
        setParticipantsCountByEvent(participantsMap);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Impossible de charger les donnees du dashboard.");
        } else {
          setError("Impossible de charger les donnees du dashboard.");
        }
        setParticipantsCountByEvent({});
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeProjectsCount = useMemo(
    () =>
      projects.filter((project) => (project.status || "").trim().toLowerCase() === "active").length,
    [projects]
  );
  const totalProjectsCount = useMemo(() => projects.length, [projects]);

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [projects]
  );

  const recentEvents = useMemo(
    () =>
      [...events]
        .sort((a, b) => {
          const aTs = new Date(a.createdAt || a.date).getTime();
          const bTs = new Date(b.createdAt || b.date).getTime();
          return bTs - aTs;
        })
        .slice(0, 5),
    [events]
  );

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement du dashboard...</div>;
  }

  return (
    <section className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Tous les projets</p>
            <span className="rounded-lg bg-[#e9ebff] p-2 text-[#2E3191]">
              <Layers3 size={16} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-[#2E3191]">{totalProjectsCount}</p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Nombre d&apos;evenements
            </p>
            <span className="rounded-lg bg-[#e9ebff] p-2 text-[#2E3191]">
              <CalendarDays size={16} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-[#2E3191]">{events.length}</p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Projets actifs</p>
            <span className="rounded-lg bg-[#e9ebff] p-2 text-[#2E3191]">
              <FolderKanban size={16} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-[#2E3191]">{activeProjectsCount}</p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <FolderKanban size={16} className="text-[#2E3191]" />
                Projets recents
              </h2>
          </div>
          <div className="mt-4 space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun projet recent.</p>
            ) : (
              recentProjects.map((project) => (
                <div key={project._id} className="rounded-lg border border-gray-100 px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{project.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Cree le {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e9ebff] px-2.5 py-1 text-xs font-medium text-[#2E3191]">
                      {project.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <CalendarDays size={16} className="text-[#2E3191]" />
                Evenements recents
              </h2>
          </div>
          <div className="mt-4 space-y-3">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun evenement recent.</p>
            ) : (
              recentEvents.map((event) => (
                <div key={event._id} className="rounded-lg border border-gray-100 px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="mt-1 text-xs text-gray-600">
                        👥 {participantsCountByEvent[event._id] ?? 0} participants
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Date {new Date(event.date).toLocaleDateString("fr-FR")}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {event.city} • {event.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e9ebff] px-2.5 py-1 text-xs font-medium text-[#2E3191]">
                      {event.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
