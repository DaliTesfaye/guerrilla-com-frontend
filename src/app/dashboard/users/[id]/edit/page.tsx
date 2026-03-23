"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { updateUserSchema, type UpdateUserFormData } from "@/lib/validation";

type Status = "active" | "inactive";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "client";
  status: Status;
  createdAt?: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "active",
    },
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
        reset({
          name: res.data.name,
          email: res.data.email,
          status: res.data.status as Status,
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Impossible de charger l'utilisateur.",
          );
        } else {
          setError("Impossible de charger l'utilisateur.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, reset]);

  const onSubmit = async (data: UpdateUserFormData) => {
    setError("");

    try {
      await api.patch(`/users/${userId}`, data);
      alert("Utilisateur modifié avec succès!");
      router.push("/dashboard/users");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Modification impossible.");
      } else {
        setError("Modification impossible.");
      }
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="text-sm text-[#C7072C]">Utilisateur non trouvé.</div>
    );
  }

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Modifier l'utilisateur
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Mettez à jour les informations de {user.name}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {/* User info display */}
        <div className="mb-6 pb-6 border-b border-gray-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Rôle:</span>
            <span className="rounded-full bg-[#e9ebff] px-2.5 py-1 text-xs font-medium text-brand-primary">
              {user.role}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Créé le:</span>
            <span className="text-xs text-gray-700">
              {new Date(user.createdAt || "").toLocaleDateString("fr-FR") ||
                "—"}
            </span>
          </div>
        </div>

        {/* Form */}
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
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700"
            >
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
              {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/users")}
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
