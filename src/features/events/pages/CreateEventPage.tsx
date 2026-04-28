"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { createEventSchema, type CreateEventFormData } from "@/lib/validation";

export default function CreateEventPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      date: "",
      type: "",
    },
  });

  const onSubmit = async (data: CreateEventFormData) => {
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: data.name.trim(),
        date: data.date,
        type: data.type?.trim() || "",
      };

      const res = await api.post("/events", payload);
      setSuccess(res.data?.message || "Evenement cree avec succes. Redirection...");

      setTimeout(() => {
        router.push("/dashboard/events");
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
        <h1 className="text-2xl font-semibold text-gray-900">Creer un Evenement</h1>
        <p className="text-sm text-gray-500 mt-1">Ajoutez un nouvel evenement a la plateforme.</p>
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
              placeholder="Ex: Lancement Produit Q2"
              {...register("name")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.name?.message && (
              <p className="text-xs text-[#C7072C]">{errors.name.message}</p>
            )}
          </div>

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
            <label htmlFor="type" className="text-sm font-medium text-gray-700">
              Type
            </label>
            <input
              id="type"
              type="text"
              placeholder="Optionnel"
              {...register("type")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.type?.message && (
              <p className="text-xs text-[#C7072C]">{errors.type.message}</p>
            )}
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
              onClick={() => router.push("/dashboard/events")}
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
