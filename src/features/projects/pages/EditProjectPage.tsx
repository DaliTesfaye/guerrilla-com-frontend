"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getDashboardProjectById,
  updateDashboardProject,
} from "@/features/projects/api/projects";
import { updateProjectSchema, type UpdateProjectFormData } from "@/lib/validation";

const statusOptions = ["planned", "active", "completed"] as const;

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectFormData>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      clientName: "",
      status: "planned",
      startDate: "",
      endDate: "",
      image: "",
    },
  });

  useEffect(() => {
    const loadProject = async () => {
      setError("");
      try {
        const project = await getDashboardProjectById(projectId);
        reset({
          name: project.name,
          description: project.description,
          clientName: project.clientName,
          status: project.status,
          startDate: project.startDate ? project.startDate.slice(0, 10) : "",
          endDate: project.endDate ? project.endDate.slice(0, 10) : "",
          budget: project.budget,
          image: project.image || "",
        });
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

    loadProject();
  }, [projectId, reset]);

  const onSubmit = async (data: UpdateProjectFormData) => {
    setError("");
    setSuccess("");

    try {
      await updateDashboardProject(projectId, {
        name: data.name?.trim(),
        description: data.description?.trim(),
        clientName: data.clientName?.trim(),
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        image: data.image?.trim() || undefined,
      });

      setSuccess("Projet modifie avec succes. Redirection...");
      setTimeout(() => {
        router.push(`/dashboard/projects/${projectId}`);
      }, 900);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Modification impossible.");
      } else {
        setError("Modification impossible.");
      }
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement du projet...</div>;
  }

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Modifier le projet</h1>
        <p className="mt-1 text-sm text-gray-500">Mettez a jour les informations du projet.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.name?.message && <p className="text-xs text-[#C7072C]">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.description?.message && (
              <p className="text-xs text-[#C7072C]">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="clientName" className="text-sm font-medium text-gray-700">
              Client
            </label>
            <input
              id="clientName"
              type="text"
              {...register("clientName")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.clientName?.message && (
              <p className="text-xs text-[#C7072C]">{errors.clientName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Statut
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status?.message && (
              <p className="text-xs text-[#C7072C]">{errors.status.message}</p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Date de debut
              </label>
              <input
                id="startDate"
                type="date"
                {...register("startDate")}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.startDate?.message && (
                <p className="text-xs text-[#C7072C]">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                Date de fin
              </label>
              <input
                id="endDate"
                type="date"
                {...register("endDate")}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.endDate?.message && (
                <p className="text-xs text-[#C7072C]">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="budget" className="text-sm font-medium text-gray-700">
                Budget (optionnel)
              </label>
              <input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                {...register("budget", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.budget?.message && (
                <p className="text-xs text-[#C7072C]">{errors.budget.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="image" className="text-sm font-medium text-gray-700">
                Image URL (optionnel)
              </label>
              <input
                id="image"
                type="url"
                {...register("image", {
                  setValueAs: (value: string) =>
                    typeof value === "string" && value.trim() === ""
                      ? undefined
                      : value.trim(),
                })}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.image?.message && (
                <p className="text-xs text-[#C7072C]">{errors.image.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-70"
            >
              {isSubmitting ? "Mise a jour..." : "Enregistrer les modifications"}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/dashboard/projects/${projectId}`)}
              className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
