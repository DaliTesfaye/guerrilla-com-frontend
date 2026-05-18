"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEvent } from "@/features/events/api/events";
import { fetchServices, type ServiceItem } from "@/features/services/api/services";
import { createEventV2Schema, type CreateEventV2FormData } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";

const statusOptions = ["draft", "planned", "ongoing", "completed"] as const;

export default function CreateProjectEventPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params.projectId || params.id) as string;
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");
  const accessDenied = !!user && !canManage;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    if (user && !canManage) {
      router.replace(`/dashboard/projects/${projectId}`);
    }
  }, [canManage, projectId, router, user]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventV2FormData>({
    resolver: zodResolver(createEventV2Schema),
    defaultValues: {
      title: "",
      description: "",
      service: "",
      projectId,
      status: "planned",
      date: "",
      city: "",
      location: "",
      image: "",
      maxParticipants: undefined,
      hasGame: false,
      gameName: "",
    },
  });

  const hasGame = watch("hasGame");

  useEffect(() => {
    const loadServices = async () => {
      setError("");
      try {
        const servicesList = await fetchServices();
        setServices(servicesList);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Impossible de charger les services.");
        } else {
          setError("Impossible de charger les services.");
        }
      } finally {
        setLoadingOptions(false);
      }
    };

    loadServices();
  }, []);

  const onSubmit = async (data: CreateEventV2FormData) => {
    setError("");
    setSuccess("");

    try {
      await createEvent({
        title: data.title.trim(),
        description: data.description?.trim() || "",
        service: data.service.trim(),
        projectId,
        status: data.status,
        date: data.date,
        city: data.city.trim(),
        location: data.location.trim(),
        image: data.image?.trim() || undefined,
        maxParticipants: data.maxParticipants,
        hasGame: data.hasGame,
        gameName: data.gameName?.trim() || undefined,
      });

      setSuccess("Evenement cree avec succes. Redirection...");
      setTimeout(() => {
        router.push(`/dashboard/projects/${projectId}`);
      }, 900);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Creation impossible.");
      } else {
        setError("Creation impossible.");
      }
    }
  };

  if (accessDenied) {
    return <div className="text-sm text-gray-500">Acces non autorise.</div>;
  }

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Creer un Evenement</h1>
        <p className="mt-1 text-sm text-gray-500">
          L&apos;evenement sera automatiquement lie a ce projet.
        </p>
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
        {loadingOptions ? (
          <p className="text-sm text-gray-500">Chargement des options...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.title?.message && (
                <p className="text-xs text-[#C7072C]">{errors.title.message}</p>
              )}
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

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="service" className="text-sm font-medium text-gray-700">
                  Service
                </label>
                <select
                  id="service"
                  {...register("service")}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
                >
                  <option value="">Select service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.service?.message && (
                  <p className="text-xs text-[#C7072C]">{errors.service.message}</p>
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
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  {...register("date")}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
                />
                {errors.date?.message && (
                  <p className="text-xs text-[#C7072C]">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  {...register("city")}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
                />
                {errors.city?.message && (
                  <p className="text-xs text-[#C7072C]">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Lieu
                </label>
                <input
                  id="location"
                  type="text"
                  {...register("location")}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
                />
                {errors.location?.message && (
                  <p className="text-xs text-[#C7072C]">{errors.location.message}</p>
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
                      typeof value === "string" && value.trim() === "" ? undefined : value.trim(),
                  })}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
                />
                {errors.image?.message && (
                  <p className="text-xs text-[#C7072C]">{errors.image.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="maxParticipants" className="text-sm font-medium text-gray-700">
                  Max participants (optionnel)
                </label>
                <input
                  id="maxParticipants"
                  type="number"
                  min="0"
                  step="1"
                  {...register("maxParticipants", {
                    setValueAs: (value) =>
                      value === "" || value === null || value === undefined
                        ? undefined
                        : Number(value),
                  })}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
                />
                {errors.maxParticipants?.message && (
                  <p className="text-xs text-[#C7072C]">{errors.maxParticipants.message}</p>
                )}
              </div>

              <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    {...register("hasGame")}
                    className="h-4 w-4 rounded border-gray-300 text-[#2E3191] focus:ring-[#2E3191]"
                  />
                  Activer le jeu
                </label>

                {hasGame && (
                  <div className="space-y-1.5">
                    <label htmlFor="gameName" className="text-sm font-medium text-gray-700">
                      Nom du jeu
                    </label>
                    <input
                      id="gameName"
                      type="text"
                      {...register("gameName")}
                      className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
                    />
                    {errors.gameName?.message && (
                      <p className="text-xs text-[#C7072C]">{errors.gameName.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-70"
              >
                {isSubmitting ? "Creation..." : "Creer l'evenement"}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/dashboard/projects/${projectId}`)}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Retour au projet
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
