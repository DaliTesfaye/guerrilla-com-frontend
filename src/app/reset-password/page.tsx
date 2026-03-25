"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    setValue("token", tokenFromUrl);
  }, [tokenFromUrl, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/reset-password", data);
      setSuccess(
        res.data?.message ||
          "Mot de passe reinitialise avec succes. Redirection..."
      );
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Lien invalide ou expire. Veuillez recommencer."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface px-6">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reinitialiser le mot de passe</h1>
          <p className="text-sm text-gray-500 mt-1">
            Choisissez un nouveau mot de passe securise.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" {...register("token")} />

          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-gray-700 font-medium">
              Nouveau mot de passe
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...register("newPassword")}
              className="h-11 bg-white border-gray-200 focus-visible:ring-brand-primary"
            />
            {errors.newPassword?.message && (
              <p className="text-xs text-brand-danger">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmNewPassword" className="text-gray-700 font-medium">
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmNewPassword")}
              className="h-11 bg-white border-gray-200 focus-visible:ring-brand-primary"
            />
            {errors.confirmNewPassword?.message && (
              <p className="text-xs text-brand-danger">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          {errors.token?.message && (
            <div className="text-sm text-brand-danger bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
              {errors.token.message}
            </div>
          )}

          {error && (
            <div className="text-sm text-brand-danger bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-100 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold rounded-lg"
          >
            {isSubmitting ? "Reinitialisation..." : "Reinitialiser"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/login" className="text-brand-primary hover:underline">
            Retour a la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
