"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("");
    setSuccess("");
    setResetUrl("");

    try {
      const res = await api.post("/auth/forgot-password", data);
      setSuccess(
        res.data?.message ||
          "Si ce compte existe, un e-mail de reinitialisation a ete envoye."
      );
      if (res.data?.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Impossible d'envoyer le lien de reinitialisation."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface px-6">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublie</h1>
          <p className="text-sm text-gray-500 mt-1">
            Entrez votre e-mail pour recevoir un lien de reinitialisation.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Adresse e-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@guerrillacom.com"
              {...register("email")}
              className="h-11 bg-white border-gray-200 focus-visible:ring-brand-primary"
            />
            {errors.email?.message && (
              <p className="text-xs text-brand-danger">{errors.email.message}</p>
            )}
          </div>

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

          {resetUrl && (
            <div className="text-sm text-brand-primary bg-blue-50 border border-blue-100 px-4 py-3 rounded-lg break-all">
              <p className="font-medium">Lien de reinitialisation (mode local):</p>
              <a href={resetUrl} className="underline hover:no-underline">
                {resetUrl}
              </a>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold rounded-lg"
          >
            {isSubmitting ? "Envoi..." : "Envoyer le lien"}
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
