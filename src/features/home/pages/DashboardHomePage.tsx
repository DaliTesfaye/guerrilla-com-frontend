"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FolderKanban, Layers3, Users } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
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

  const totalParticipantsCount = useMemo(
    () => events.reduce((sum, ev) => sum + (participantsCountByEvent[ev._id] ?? 0), 0),
    [events, participantsCountByEvent]
  );

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

  // Chart helpers: keep ticks integer and a light modern look
  const activeEventsCount = useMemo(
    () => events.filter((ev) => (ev.status || "").trim().toLowerCase() === "active").length,
    [events]
  );

  const chartMax = Math.max(5, totalParticipantsCount, events.length, totalProjectsCount, activeEventsCount, activeProjectsCount);
  const chartData = {
    labels: ["Participants", "Événements", "Événements actifs", "Projets", "Projets actifs"],
    datasets: [
      {
        label: "Nombre",
        data: [totalParticipantsCount, events.length, activeEventsCount, totalProjectsCount, activeProjectsCount],
        backgroundColor: [
          "rgba(79,70,229,0.10)",
          "rgba(6,182,212,0.10)",
          "rgba(6,182,212,0.18)",
          "rgba(16,185,129,0.10)",
          "rgba(16,185,129,0.18)",
        ],
        borderColor: ["#4F46E5", "#06B6D4", "#06B6D4", "#10B981", "#10B981"],
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 18,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        // force integer ticks by using stepSize = 1 and set a sensible max
        max: Math.max(chartMax, 5),
        ticks: {
          stepSize: 1,
          // show integer ticks only
          callback: (value: any) => String(Math.round(Number(value))),
          color: "#6b7280",
          padding: 8,
        },
        grid: {
          color: "rgba(15,23,42,0.06)",
          drawBorder: false,
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${Math.round(context.parsed.y).toLocaleString()} `;
          },
        },
      },
    },
  };

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

      <div className="grid gap-4 sm:grid-cols-4">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Nombre de participants total</p>
            <span className="rounded-lg bg-[#e9ebff] p-2 text-[#2E3191]">
              <Users size={16} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-[#2E3191]">{totalParticipantsCount}</p>
        </article>

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

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Résumé</h3>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions as any} />
        </div>
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
