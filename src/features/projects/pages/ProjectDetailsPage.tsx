"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  deleteDashboardProject,
  getDashboardProjectDetails,
  type DashboardProject,
} from "@/features/projects/api/projects";
import { getEventsByProjectId, type EventItem } from "@/features/events/api/events";
import EventCard from "@/features/events/components/EventCard";
import { useAuthStore } from "@/store/authStore";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");

  const [project, setProject] = useState<DashboardProject | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setError("");
      try {
        const [details, relatedEvents] = await Promise.all([
          getDashboardProjectDetails(projectId),
          getEventsByProjectId(projectId),
        ]);

        setProject(details.project);
        setEvents(relatedEvents);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Impossible de charger le projet.");
        } else {
          setError("Impossible de charger le projet.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectId]);

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString("fr-FR") : "—";

  const formatBudget = (value?: number) =>
    typeof value === "number"
      ? new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "TND",
          maximumFractionDigits: 0,
        }).format(value)
      : "—";

  const handleDelete = async () => {
    if (!project) {
      return;
    }

    const shouldDelete = window.confirm("Voulez-vous vraiment supprimer ce projet ?");
    if (!shouldDelete) {
      return;
    }

    setDeleting(true);
    setError("");
    try {
      await deleteDashboardProject(project._id);
      router.push("/dashboard/projects");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Suppression impossible.");
      } else {
        setError("Suppression impossible.");
      }
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement du projet...</div>;
  }

  if (!project) {
    return <div className="text-sm text-[#C7072C]">Projet non trouve.</div>;
  }

  return (
    <section className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="h-40 w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 md:w-64">
            {project.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
              <span className="rounded-full bg-[#e9ebff] px-2.5 py-1 text-xs font-medium text-[#2E3191]">
                {project.status}
              </span>
            </div>
            <p className="text-sm text-gray-700">
              Client: <span className="font-medium">{project.clientName}</span>
            </p>
            <p className="text-sm text-gray-700">
              Budget: <span className="font-medium">{formatBudget(project.budget)}</span>
            </p>
            <p className="text-sm text-gray-700">
              Periode:{" "}
              <span className="font-medium">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Informations du projet</h2>
        <p className="mt-3 text-sm text-gray-700">{project.description || "—"}</p>
        <div className="mt-4 grid gap-4 text-sm text-gray-600 md:grid-cols-2">
          <p>Cree le: {formatDate(project.createdAt)}</p>
          <p>Derniere mise a jour: {formatDate(project.updatedAt)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Statistiques</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total events</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{events.length}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Active events</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {events.filter((event) => event.status === "ongoing").length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total participants</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {events.reduce((acc, event) => acc + (event.participantsCount || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Related Events</h2>
          {canManage && (
            <Link
              href={`/dashboard/projects/${project._id}/events/create`}
              className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition"
            >
              + Creer Event
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <p className="mt-5 text-sm text-gray-500">No events linked to this project yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                detailsHref={`/dashboard/events/${event._id}`}
              />
            ))}
          </div>
        )}
      </div>

      {canManage && (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/dashboard/projects/${project._id}/edit`}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Modifier le projet
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center rounded-lg bg-[#C7072C] px-4 py-2 text-sm font-medium text-white hover:bg-[#a30624] transition disabled:opacity-60"
          >
            {deleting ? "Suppression..." : "Supprimer le projet"}
          </button>
        </div>
      )}
    </section>
  );
}
