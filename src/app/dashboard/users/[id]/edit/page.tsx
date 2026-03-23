"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";

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

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("active");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setStatus(res.data.status);
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
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.patch(`/users/${userId}`, { name, email, status });
      alert("Utilisateur modifié avec succès!");
      router.push("/dashboard/users");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Modification impossible.");
      } else {
        setError("Modification impossible.");
      }
    } finally {
      setSubmitting(false);
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ex: Ahmed Ben Salah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
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
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-70"
            >
              {submitting ? "Mise à jour..." : "Enregistrer les modifications"}
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
