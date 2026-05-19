"use client";

import { useEffect, useMemo, useState } from "react";
import { FilePlus2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { getDashboardProjectById } from "@/features/projects/api/projects";
import { fetchServices, type ServiceItem } from "@/features/services/api/services";
import { createInvoice } from "@/features/invoices/api/invoices";
import { createInvoiceSchema, type CreateInvoiceFormData } from "@/lib/validation";

export default function CreateProjectInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params.projectId || params.id) as string;
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const defaultInvoiceNumber = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `INV-${yyyy}${mm}${dd}-${hh}${min}`;
  }, []);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      invoiceNumber: defaultInvoiceNumber,
      projectId,
      clientName: "",
      services: [],
      amount: 0,
      issueDate: today,
      dueDate: "",
      status: "draft",
      notes: "",
    },
  });

  useEffect(() => {
    const loadOptions = async () => {
      setError("");
      try {
        const [project, serviceList] = await Promise.all([
          getDashboardProjectById(projectId),
          fetchServices(),
        ]);
        setClientName(project.clientName || "");
        setProjectName(project.name || "");
        setServices(serviceList);
        setValue("projectId", projectId, { shouldValidate: true });
        setValue("clientName", project.clientName || "", { shouldValidate: true });
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Impossible de charger le projet.");
        } else {
          setError("Impossible de charger le projet.");
        }
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [projectId, setValue]);

  const servicesValue = watch("services") || [];

  const onSubmit = async (data: CreateInvoiceFormData) => {
    setError("");
    setSuccess("");
    try {
      const created = await createInvoice({
        invoiceNumber: data.invoiceNumber.trim(),
        projectId,
        clientName: clientName || data.clientName.trim(),
        services: data.services ?? [],
        amount: data.amount,
        issueDate: data.issueDate,
        dueDate: data.dueDate?.trim() || undefined,
        status: data.status,
        notes: data.notes?.trim() || undefined,
      });

      setSuccess("Facture creee avec succes. Redirection...");
      window.setTimeout(() => {
        router.push(`/dashboard/invoices/${created._id}`);
      }, 900);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Creation impossible.");
      } else {
        setError("Creation impossible.");
      }
    }
  };

  if (!canManage) {
    return <div className="text-sm text-gray-500">Acces non autorise.</div>;
  }

  if (loadingOptions) {
    return <div className="text-sm text-gray-500">Chargement des options...</div>;
  }

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <FilePlus2 size={22} className="text-[#2E3191]" />
          Creer une Facture
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Creation contextuelle pour le projet:{" "}
          <span className="font-medium">{projectName || projectId}</span>
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
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-700">
                Invoice number
              </label>
              <input
                id="invoiceNumber"
                type="text"
                {...register("invoiceNumber")}
                className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.invoiceNumber?.message && (
                <p className="text-xs text-[#C7072C]">{errors.invoiceNumber.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                Client
              </label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                readOnly
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...register("amount", {
                  setValueAs: (value) => Number(value),
                })}
                className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.amount?.message && (
                <p className="text-xs text-[#C7072C]">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              >
                <option value="draft">draft</option>
                <option value="sent">sent</option>
                <option value="paid">paid</option>
              </select>
              {errors.status?.message && (
                <p className="text-xs text-[#C7072C]">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="issueDate" className="text-sm font-medium text-gray-700">
                Issue date
              </label>
              <input
                id="issueDate"
                type="date"
                {...register("issueDate")}
                className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.issueDate?.message && (
                <p className="text-xs text-[#C7072C]">{errors.issueDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                Due date (optionnel)
              </label>
              <input
                id="dueDate"
                type="date"
                {...register("dueDate")}
                className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.dueDate?.message && (
                <p className="text-xs text-[#C7072C]">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Services</label>
              <p className="text-xs text-gray-500">Select one or more services from the list.</p>
            </div>
            {errors.services?.message && (
              <p className="text-xs text-[#C7072C]">{errors.services.message}</p>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {services.map((service) => {
                const checked = servicesValue.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                      checked
                        ? "border-[#2E3191] bg-[#eef0ff]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...servicesValue, service.id]
                          : servicesValue.filter((id) => id !== service.id);
                        setValue("services", next, { shouldValidate: true });
                      }}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2E3191] focus:ring-[#2E3191]"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-gray-900">{service.name}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes (optionnel)
            </label>
            <textarea
              id="notes"
              rows={4}
              {...register("notes")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-70"
            >
              {isSubmitting ? "Creation..." : "Creer la facture"}
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
      </div>
    </section>
  );
}
