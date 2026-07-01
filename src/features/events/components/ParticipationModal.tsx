"use client";

import { useState, type FormEvent } from "react";
import { participateInEvent } from "@/features/events/api/events";

interface ParticipationModalProps {
  eventId: string;
  eventName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ParticipationModal({
  eventId,
  eventName,
  onClose,
  onSuccess,
}: ParticipationModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleParticipate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setSubmitError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setEmailError("L'email est obligatoire.");
      return;
    }

    setIsSubmitting(true);

    try {
      await participateInEvent(eventId, {
        email: email.trim(),
        name: fullName.trim() || undefined,
      });

      setSuccessMessage("Participation enregistrée ✅");
      setFullName("");
      setEmail("");
      
      if (onSuccess) {
        onSuccess();
      }

      window.setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      const normalized = message.toLowerCase();
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? Number((err as { status?: number }).status)
          : undefined;

      if (
        status === 409 ||
        normalized.includes("deja") ||
        normalized.includes("déjà") ||
        normalized.includes("already") ||
        normalized.includes("exist") ||
        normalized.includes("registered") ||
        normalized.includes("enregistr")
      ) {
        setSubmitError("Votre email est déjà enregistré");
      } else if (normalized.includes("email")) {
        setSubmitError("Email invalide");
      } else {
        setSubmitError(message || "Une erreur est survenue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-brand-primary">Participer</h3>
            <p className="mt-1 text-sm text-slate-500">
              Événement: <span className="font-medium text-slate-700">{eventName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleParticipate}>
          {successMessage && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <div className="flex items-center justify-between gap-3">
                <span>{successMessage}</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-emerald-200 bg-white px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="event-email" className="text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="event-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              required
              className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-900"
            />
            {emailError && <p className="text-xs text-brand-danger">{emailError}</p>}
            {submitError && <p className="text-xs text-brand-danger">{submitError}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="event-fullname" className="text-sm font-medium text-gray-700">
              Nom complet (optionnel)
            </label>
            <input
              id="event-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
              className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-dark"
            >
              {isSubmitting ? "Envoi..." : "Confirmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
