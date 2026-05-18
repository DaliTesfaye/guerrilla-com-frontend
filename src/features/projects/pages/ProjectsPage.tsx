"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban } from "lucide-react";
import axios from "axios";
import {
  deleteDashboardProject,
  getDashboardProjects,
  type DashboardProject,
} from "@/features/projects/api/projects";
import { useAuthStore } from "@/store/authStore";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");

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

  useEffect(() => {
    const fetchProjects = async () => {
      setError("");
      try {
        const projectList = await getDashboardProjects();
        setProjects(projectList);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Impossible de charger les projets.");
        } else {
          setError("Impossible de charger les projets.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId: string) => {
    const shouldDelete = window.confirm("Voulez-vous vraiment supprimer ce projet ?");
    if (!shouldDelete) {
      return;
    }

    setDeletingId(projectId);
    setError("");
    try {
      await deleteDashboardProject(projectId);
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Suppression impossible.");
      } else {
        setError("Suppression impossible.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement des projets...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <FolderKanban size={22} className="text-[#2E3191]" />
            Projets
          </h1>
          <p className="text-sm text-gray-500 mt-1">Liste des campagnes et projets operationnels</p>
        </div>

        {canManage && (
          <Link
            href="/dashboard/projects/create"
            className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition"
          >
            + Creer Projet
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
          <p className="text-sm text-gray-500">Aucun projet trouve.</p>
          {canManage && (
            <Link
              href="/dashboard/projects/create"
              className="mt-4 inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition"
            >
              Creer votre premier projet
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#2E3191]/25 hover:shadow-md"
            >
              <div className="h-36 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-900">{project.name}</h2>
                  <span className="rounded-full bg-[#e9ebff] px-2.5 py-1 text-xs font-medium text-[#2E3191]">
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700">
                  Client: <span className="font-medium">{project.clientName || "—"}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Budget: <span className="font-medium">{formatBudget(project.budget)}</span>
                </p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {project.description?.trim() ? project.description : "—"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/dashboard/projects/${project._id}`}
                  className="text-xs font-medium text-[#2E3191] hover:underline"
                >
                  Ouvrir
                </Link>
                {canManage && (
                  <Link
                    href={`/dashboard/projects/${project._id}/edit`}
                    className="text-xs font-medium text-gray-700 hover:underline"
                  >
                    Modifier
                  </Link>
                )}
                {canManage && (
                  <button
                    type="button"
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    className="text-xs font-medium text-[#C7072C] hover:underline disabled:opacity-60"
                  >
                    {deletingId === project._id ? "Suppression..." : "Supprimer"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
