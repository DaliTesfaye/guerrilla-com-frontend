"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FilePenLine } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getInvoiceById, updateInvoice } from "@/features/invoices/api/invoices";
import { fetchServices, type ServiceItem } from "@/features/services/api/services";
import { updateInvoiceSchema, type UpdateInvoiceFormData } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateInvoiceFormData>({
    resolver: zodResolver(updateInvoiceSchema),
    defaultValues: {
      invoiceNumber: "",
      clientName: "",
      projectId: "",
      services: [],
      amount: undefined,
      issueDate: "",
      dueDate: "",
      status: "draft",
      notes: "",
    },
  });

  useEffect(() => {
    const loadInvoice = async () => {
      setError("");
      try {
        const [invoice, serviceList] = await Promise.all([getInvoiceById(invoiceId), fetchServices()]);
        setServices(serviceList);
        reset({
          invoiceNumber: invoice.invoiceNumber,
          projectId: invoice.projectId,
          clientName: invoice.clientName,
          services: invoice.services,
          amount: invoice.amount,
          issueDate: invoice.issueDate ? invoice.issueDate.slice(0, 10) : "",
          dueDate: invoice.dueDate ? invoice.dueDate.slice(0, 10) : "",
          status: invoice.status,
          notes: invoice.notes || "",
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Impossible de charger la facture.");
        } else {
          setError("Impossible de charger la facture.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId, reset]);

  const servicesValue = watch("services") || [];

  const onSubmit = async (data: UpdateInvoiceFormData) => {
    setError("");
    setSuccess("");
    try {
      const updated = await updateInvoice(invoiceId, {
        invoiceNumber: data.invoiceNumber?.trim(),
        clientName: data.clientName?.trim(),
        projectId: data.projectId?.trim(),
        services: data.services,
        amount: data.amount,
        issueDate: data.issueDate,
        dueDate: data.dueDate?.trim() || undefined,
        status: data.status,
        notes: data.notes?.trim() || undefined,
      });

      setSuccess("Facture modifiee avec succes. Redirection...");
      window.setTimeout(() => {
        router.push(`/dashboard/invoices/${updated._id}`);
      }, 900);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Modification impossible.");
      } else {
        setError("Modification impossible.");
      }
    }
  };

  if (!canManage) {
    return <div className="text-sm text-gray-500">Acces non autorise.</div>;
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement de la facture...</div>;
  }

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <FilePenLine size={22} className="text-[#2E3191]" />
          Modifier la Facture
        </h1>
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
                {...register("clientName")}
                className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
              {errors.clientName?.message && (
                <p className="text-xs text-[#C7072C]">{errors.clientName.message}</p>
              )}
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
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
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
            </div>

            <div className="space-y-1.5">
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                Due date
              </label>
              <input
                id="dueDate"
                type="date"
                {...register("dueDate")}
                className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3191]"
              />
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
              Notes
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
              {isSubmitting ? "Mise a jour..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/invoices/${invoiceId}`)}
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
