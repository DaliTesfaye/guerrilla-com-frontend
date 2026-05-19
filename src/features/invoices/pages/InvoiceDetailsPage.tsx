"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileDown, FilePenLine, ReceiptText, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  deleteInvoice,
  getInvoiceById,
  type InvoiceItem,
} from "@/features/invoices/api/invoices";
import { getDashboardProjectById } from "@/features/projects/api/projects";
import { fetchServices } from "@/features/services/api/services";
import { downloadInvoicePdf } from "@/features/invoices/utils/invoicePdf";
import { useAuthStore } from "@/store/authStore";

export default function InvoiceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");
  const [invoice, setInvoice] = useState<InvoiceItem | null>(null);
  const [serviceNameMap, setServiceNameMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadInvoice = async () => {
      setError("");
      try {
        const data = await getInvoiceById(invoiceId);
        try {
          const services = await fetchServices();
          setServiceNameMap(Object.fromEntries(services.map((service) => [service.id, service.name])));
        } catch {
          setServiceNameMap({});
        }
        if (!data.projectName && data.projectId) {
          try {
            const project = await getDashboardProjectById(data.projectId);
            setInvoice({
              ...data,
              projectName: project.name,
            });
            return;
          } catch {
            setInvoice(data);
            return;
          }
        }

        setInvoice(data);
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
  }, [invoiceId]);

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "TND",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString("fr-FR") : "—";

  const statusClass = (status?: InvoiceItem["status"]) => {
    if (status === "paid") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "sent") {
      return "bg-[#e9ebff] text-[#2E3191] border-[#cfd4ff]";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (!canManage) {
    return <div className="text-sm text-gray-500">Acces non autorise.</div>;
  }

  const handlePdfDownload = () => {
    if (!invoice) {
      return;
    }
    setDownloading(true);
    downloadInvoicePdf(invoice, serviceNameMap);
    window.setTimeout(() => setDownloading(false), 500);
  };

  const handleDelete = async () => {
    if (!invoice) {
      return;
    }

    const shouldDelete = window.confirm("Voulez-vous vraiment supprimer cette facture ?");
    if (!shouldDelete) {
      return;
    }

    setDeleting(true);
    setError("");
    try {
      await deleteInvoice(invoice._id);
      router.push("/dashboard/invoices");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Suppression impossible.");
      } else {
        setError("Suppression impossible.");
      }
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement de la facture...</div>;
  }

  if (!invoice) {
    return <div className="text-sm text-[#C7072C]">Facture non trouvee.</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <ReceiptText size={22} className="text-[#2E3191]" />
          Details Facture
        </h1>
        <p className="mt-1 text-sm text-gray-500">Facture ID: {invoice._id}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Numero de facture</p>
            <p className="text-xl font-semibold text-gray-900">{invoice.invoiceNumber || "—"}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClass(invoice.status)}`}>
            {invoice.status}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Client</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{invoice.clientName || "—"}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Nom du projet</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {invoice.projectName || invoice.projectId || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Project ID / Projet ID</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {invoice.projectId || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Montant</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{formatAmount(invoice.amount)}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Date d&apos;emission</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(invoice.issueDate)}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Date d&apos;echeance</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Services</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {invoice.services.length
                ? invoice.services.map((serviceId) => serviceNameMap[serviceId] || serviceId).join(", ")
                : "—"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Notes</p>
          <p className="mt-1 text-sm text-gray-700">{invoice.notes?.trim() || "—"}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePdfDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2E3191] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e2266] transition disabled:opacity-70"
          >
            <FileDown size={16} />
            {downloading ? "Preparation..." : "Download PDF"}
          </button>
          <Link
            href={`/dashboard/invoices/${invoice._id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <FilePenLine size={16} />
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#C7072C] px-4 py-2 text-sm font-medium text-white hover:bg-[#a30624] transition disabled:opacity-70"
          >
            <Trash2 size={16} />
            {deleting ? "Suppression..." : "Delete"}
          </button>
        </div>
      </div>
    </section>
  );
}
