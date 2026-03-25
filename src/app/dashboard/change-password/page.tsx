"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/change-password", data);

      if (token && user) {
        login(token, {
          ...user,
          mustChangePassword: false,
        });
      }

      setSuccess(res.data?.message || "Password changed successfully.");
      reset();
      setTimeout(() => {
        router.push("/dashboard/users");
      }, 800);
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to change password.");
    }
  };

  return (
    <section className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Changer le mot de passe</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pour continuer, vous devez définir un nouveau mot de passe sécurisé.
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Mot de passe actuel
            </label>
            <input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.currentPassword?.message && (
              <p className="text-xs text-[#C7072C]">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.newPassword?.message && (
              <p className="text-xs text-[#C7072C]">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700">
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              {...register("confirmNewPassword")}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
            {errors.confirmNewPassword?.message && (
              <p className="text-xs text-[#C7072C]">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-70"
            >
              {isSubmitting ? "Mise a jour..." : "Mettre a jour le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
