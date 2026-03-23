"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { createAdminSchema, type CreateAdminFormData } from "@/lib/validation";

export default function CreateAdminPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "active",
    },
  });

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [createdEmail, setCreatedEmail] = useState("");

  const [error, setError] = useState("");

  const onSubmit = async (data: CreateAdminFormData) => {
    setError("");

    try {
      const res = await api.post("/users", data);

      setGeneratedPassword(res.data.generatedPassword);
      setCreatedEmail(res.data.user?.email || data.email);

      reset({
        name: "",
        email: "",
        status: "active",
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Création impossible.");
      } else {
        setError("Création impossible.");
      }
    }
  };

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Créer un Admin</h1>
        <p className="text-sm text-gray-500 mt-1">
          Le mot de passe sera généré automatiquement par le système.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ex: Ahmed Ben Salah"
              {...register("name")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.name?.message && (
              <p className="text-xs text-[#C7072C]">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@guerrillacom.com"
              {...register("email")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.email?.message && (
              <p className="text-xs text-[#C7072C]">{errors.email.message}</p>
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
              <option value="active">active</option>
              <option value="inactive">inactive</option>
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
              {isSubmitting ? "Création..." : "Créer l’admin"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/users")}
              className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Retour à la liste
            </button>
          </div>
        </form>
      </div>

      {generatedPassword && (
        <div className="rounded-2xl border border-[#2E3191]/20 bg-[#eef0ff] p-5">
          <h2 className="text-sm font-semibold text-[#2E3191]">Admin créé avec succès</h2>
          <p className="text-sm text-gray-700 mt-2">
            Email: <span className="font-medium">{createdEmail}</span>
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Mot de passe généré:
            <span className="ml-2 inline-block rounded bg-white border border-[#2E3191]/20 px-2 py-1 font-mono text-[#2E3191]">
              {generatedPassword}
            </span>
          </p>
          <p className="text-xs text-[#C7072C] mt-3">
            Important: copiez ce mot de passe maintenant. Il ne sera plus affiché ensuite.
          </p>
        </div>
      )}
    </section>
  );
}