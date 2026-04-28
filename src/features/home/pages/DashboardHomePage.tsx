"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "@/lib/api";

type Project = {
  _id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
};

type EventItem = {
  _id: string;
  name: string;
  date: string;
  type?: string;
  createdAt?: string;
};

export default function DashboardHomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setError("");
      try {
        const [projectsRes, eventsRes] = await Promise.all([
          api.get("/projects"),
          api.get("/events"),
        ]);

        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Impossible de charger les donnees du dashboard."
          );
        } else {
          setError("Impossible de charger les donnees du dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeProjectsCount = useMemo(
    () =>
      projects.filter(
        (project) => (project.status || "").trim().toLowerCase() === "active"
      ).length,
    [projects]
  );

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
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

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Projets actifs
          </p>
          <p className="mt-2 text-3xl font-bold text-[#2E3191]">{activeProjectsCount}</p>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Nombre d&apos;evenements
          </p>
          <p className="mt-2 text-3xl font-bold text-[#2E3191]">{events.length}</p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Projets recents</h2>
          </div>
          <div className="mt-4 space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun projet recent.</p>
            ) : (
              recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="rounded-lg border border-gray-100 px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {project.name}
                      </p>
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
            <h2 className="text-base font-semibold text-gray-900">Evenements recents</h2>
          </div>
          <div className="mt-4 space-y-3">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun evenement recent.</p>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event._id}
                  className="rounded-lg border border-gray-100 px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {event.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Date {new Date(event.date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#e9ebff] px-2.5 py-1 text-xs font-medium text-[#2E3191]">
                      {event.type?.trim() ? event.type : "N/A"}
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
