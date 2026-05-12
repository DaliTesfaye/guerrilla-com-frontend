"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { changePasswordSchema, updateProfileSchema } from "@/lib/validation";
import {
  changePassword,
  getProfile,
  updateProfile,
  type Profile,
} from "@/features/profile/api/profile";

type Toast = {
  type: "success" | "error";
  message: string;
};

type EditProfileFormData = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function ProfilePage() {
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadError("");
      try {
        const profile = await getProfile();
        const normalizedProfile = {
          ...profile,
          email: profile.email.toLowerCase(),
        };
        setInitialProfile(normalizedProfile);
        reset({
          name: normalizedProfile.name,
          email: normalizedProfile.email,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setLoadError(err.response?.data?.message || "Impossible de charger le profil.");
        } else {
          setLoadError("Impossible de charger le profil.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const onSubmitAll = async (data: EditProfileFormData) => {
    if (!initialProfile) {
      return;
    }

    setFormError("");
    setToast(null);

    const normalizedName = data.name.trim();
    const normalizedEmail = data.email.trim().toLowerCase();

    const profileValidation = updateProfileSchema.safeParse({
      name: normalizedName,
      email: normalizedEmail,
    });

    if (!profileValidation.success) {
      setFormError(profileValidation.error.issues[0]?.message || "Validation error");
      return;
    }

    const payload: { name?: string; email?: string } = {};
    if (normalizedName !== initialProfile.name) {
      payload.name = normalizedName;
    }
    if (normalizedEmail !== initialProfile.email.toLowerCase()) {
      payload.email = normalizedEmail;
    }

    const wantsPasswordChange =
      !!data.currentPassword.trim() ||
      !!data.newPassword.trim() ||
      !!data.confirmNewPassword.trim();

    if (wantsPasswordChange) {
      if (
        !data.currentPassword.trim() ||
        !data.newPassword.trim() ||
        !data.confirmNewPassword.trim()
      ) {
        setFormError("Pour changer le mot de passe, remplissez tous les champs mot de passe.");
        return;
      }

      const passwordValidation = changePasswordSchema.safeParse({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      if (!passwordValidation.success) {
        setFormError(passwordValidation.error.issues[0]?.message || "Validation error");
        return;
      }
    }

    if (!payload.name && !payload.email && !wantsPasswordChange) {
      setToast({ type: "success", message: "Aucune modification detectee." });
      return;
    }

    try {
      let nextProfile = initialProfile;

      if (payload.name || payload.email) {
        const updated = await updateProfile(payload);
        const updatedName = (updated.profile?.name ?? payload.name ?? nextProfile.name).trim();
        const updatedEmail = (
          updated.profile?.email ??
          payload.email ??
          nextProfile.email
        )
          .trim()
          .toLowerCase();

        nextProfile = {
          ...nextProfile,
          ...updated.profile,
          name: updatedName,
          email: updatedEmail,
        };
        setInitialProfile(nextProfile);

        if (token && currentUser) {
          login(token, {
            ...currentUser,
            name: nextProfile.name,
            email: nextProfile.email,
          });
        }
      }

      if (wantsPasswordChange) {
        await changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
      }

      setToast({ type: "success", message: "Profil mis a jour avec succes." });
      setIsEditingProfile(false);
      reset({
        name: nextProfile.name,
        email: nextProfile.email,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const backendMessage = err.response?.data?.message;

        if (status === 409) {
          setFormError("Email already exists");
          return;
        }
        if (status === 400) {
          setFormError(backendMessage || "Validation error");
          return;
        }
        setFormError(backendMessage || "Mise a jour impossible.");
        return;
      }

      setFormError("Mise a jour impossible.");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement du profil...</div>;
  }

  return (
    <section className="max-w-2xl mx-auto space-y-6">
      {toast && (
        <div className="fixed right-6 top-6 z-[80]">
          <div
            className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Mon profil</h1>
        <p className="text-sm text-gray-500 mt-1">
          Consultez vos informations puis editez-les depuis un seul formulaire.
        </p>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {loadError}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e9ebff] text-2xl font-bold text-[#2E3191]">
            {initialProfile?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <p className="mt-3 text-lg font-semibold text-gray-900">{initialProfile?.name || "—"}</p>
          <p className="text-sm text-gray-600">{initialProfile?.email || "—"}</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Nom</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{initialProfile?.name || "—"}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{initialProfile?.email || "—"}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Role</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {initialProfile?.role || currentUser?.role || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {initialProfile?.status || currentUser?.status || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Date created
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {initialProfile?.createdAt
                ? new Date(initialProfile.createdAt).toLocaleDateString("fr-FR")
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Mot de passe actuel
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">******</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (!initialProfile) return;
              reset({
                name: initialProfile.name,
                email: initialProfile.email,
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              });
              setFormError("");
              setIsEditingProfile((prev) => !prev);
            }}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {isEditingProfile ? "Fermer le formulaire" : "Modifier mes informations"}
          </button>
        </div>
      </div>

      {isEditingProfile && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center">Edition du profil</h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Modifiez vos informations et, si besoin, votre mot de passe.
          </p>

          <form onSubmit={handleSubmit(onSubmitAll)} className="mt-5 space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="profile-name" className="text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                id="profile-name"
                type="text"
                {...register("name")}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.name?.message && (
                <p className="text-xs text-[#C7072C]">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                {...register("email")}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.email?.message && (
                <p className="text-xs text-[#C7072C]">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="profile-current-password"
                className="text-sm font-medium text-gray-700"
              >
                Mot de passe actuel
              </label>
              <input
                id="profile-current-password"
                type="password"
                placeholder="******"
                {...register("currentPassword")}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-new-password" className="text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                id="profile-new-password"
                type="password"
                {...register("newPassword")}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="profile-confirm-password"
                className="text-sm font-medium text-gray-700"
              >
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="profile-confirm-password"
                type="password"
                {...register("confirmNewPassword")}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
            </div>

            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
                {formError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setFormError("");
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-70"
              >
                {isSubmitting ? "Mise a jour..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
