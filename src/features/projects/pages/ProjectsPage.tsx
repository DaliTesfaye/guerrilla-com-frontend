"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";

type Project = {
  _id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setError("");
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
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

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement des projets...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projets</h1>
          <p className="text-sm text-gray-500 mt-1">Liste des projets enregistres</p>
        </div>

        <Link
          href="/dashboard/projects/create"
          className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition"
        >
          + Creer Projet
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f4f5fb] text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Cree le</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Aucun projet trouve.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-900">{project.name}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {project.description?.trim() ? project.description : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#e9ebff] px-2.5 py-1 text-xs font-medium text-[#2E3191]">
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
