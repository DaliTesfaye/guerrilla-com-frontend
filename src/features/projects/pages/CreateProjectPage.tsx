"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import {
  createProjectSchema,
  type CreateProjectFormData,
} from "@/lib/validation";

const statusOptions = ["active", "archived"] as const;

export default function CreateProjectPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: statusOptions[0],
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
        status: data.status.trim(),
      };

      const res = await api.post("/projects", payload);
      setSuccess(res.data?.message || "Projet cree avec succes. Redirection...");

      setTimeout(() => {
        router.push("/dashboard/projects");
      }, 900);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Creation impossible.");
      } else {
        setError("Creation impossible.");
      }
    }
  };

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Creer un Projet</h1>
        <p className="text-sm text-gray-500 mt-1">Ajoutez un nouveau projet a la plateforme.</p>
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
              placeholder="Ex: Campagne Back To School"
              {...register("name")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.name?.message && (
              <p className="text-xs text-[#C7072C]">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Description du projet (optionnel)"
              {...register("description")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.description?.message && (
              <p className="text-xs text-[#C7072C]">{errors.description.message}</p>
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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-70"
            >
              {isSubmitting ? "Creation..." : "Creer le projet"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/projects")}
              className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Retour a la liste
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
