"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FileDown, ReceiptText } from "lucide-react";
import axios from "axios";
import { deleteInvoice, getInvoices, type InvoiceItem } from "@/features/invoices/api/invoices";
import { getDashboardProjects } from "@/features/projects/api/projects";
import { fetchServices } from "@/features/services/api/services";
import { downloadInvoicePdf } from "@/features/invoices/utils/invoicePdf";
import { useAuthStore } from "@/store/authStore";

export default function InvoicesPage() {
  const user = useAuthStore((state) => state.user);
  const canManage = !!user && (user.role === "admin" || user.role === "super_admin");
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [serviceNameMap, setServiceNameMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setError("");
    try {
      const data = await getInvoices();
      let projectNames = new Map<string, string>();
      let serviceNames: Record<string, string> = {};

      try {
        const projects = await getDashboardProjects();
        projectNames = new Map(projects.map((project) => [project._id, project.name]));
      } catch {
        projectNames = new Map();
      }

      try {
        const services = await fetchServices();
        serviceNames = Object.fromEntries(services.map((service) => [service.id, service.name]));
      } catch {
        serviceNames = {};
      }

      setServiceNameMap(serviceNames);
      setInvoices(
        data.map((invoice) => ({
          ...invoice,
          projectName: invoice.projectName || projectNames.get(invoice.projectId) || invoice.projectId,
        }))
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Impossible de charger les factures.");
      } else {
        setError("Impossible de charger les factures.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  if (!canManage) {
    return <div className="text-sm text-gray-500">Acces non autorise.</div>;
  }

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "TND",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString("fr-FR") : "—";

  const statusClass = (status: InvoiceItem["status"]) => {
    if (status === "paid") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "sent") {
      return "bg-[#e9ebff] text-[#2E3191] border-[#cfd4ff]";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleDelete = async (invoiceId: string) => {
    const shouldDelete = window.confirm("Voulez-vous vraiment supprimer cette facture ?");
    if (!shouldDelete) {
      return;
    }

    setDeletingId(invoiceId);
    setError("");
    try {
      await deleteInvoice(invoiceId);
      await loadInvoices();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Suppression impossible.");
      } else {
        setError("Suppression impossible.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement des factures...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <ReceiptText size={22} className="text-[#2E3191]" />
          Factures
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Liste des factures generees depuis les projets.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-[#C7072C]">
          {error}
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Aucune facture trouvee.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Invoice number
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nom du projet
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Issue date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{invoice.invoiceNumber || "—"}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{invoice.clientName || "—"}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    {invoice.projectName || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{formatAmount(invoice.amount)}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{formatDate(invoice.issueDate)}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/dashboard/invoices/${invoice._id}`}
                        className="font-medium text-[#2E3191] hover:underline"
                      >
                        Preview
                      </Link>
                      <button
                        type="button"
                        onClick={() => downloadInvoicePdf(invoice, serviceNameMap)}
                        className="inline-flex items-center gap-1 font-medium text-gray-700 hover:underline"
                      >
                        <FileDown size={13} />
                        PDF
                      </button>
                      <Link
                        href={`/dashboard/invoices/${invoice._id}/edit`}
                        className="font-medium text-gray-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(invoice._id)}
                        disabled={deletingId === invoice._id}
                        className="font-medium text-[#C7072C] hover:underline disabled:opacity-60"
                      >
                        {deletingId === invoice._id ? "Suppression..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
