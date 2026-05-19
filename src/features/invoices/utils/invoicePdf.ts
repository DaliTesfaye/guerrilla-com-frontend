import { jsPDF } from "jspdf";
import type { InvoiceItem } from "@/features/invoices/api/invoices";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value?: string): string {
  return value ? new Date(value).toLocaleDateString("fr-FR") : "—";
}

export function downloadInvoicePdf(
  invoice: InvoiceItem,
  serviceNameMap: Record<string, string> = {}
): void {
  const serviceLabels = invoice.services.map((serviceId) => serviceNameMap[serviceId] || serviceId);
  const doc = new jsPDF();

  let y = 18;
  const addLine = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "—", 58, y);
    y += 8;
  };

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Facture", 14, y);
  y += 12;

  doc.setFontSize(11);
  addLine("Numero", invoice.invoiceNumber || "—");
  addLine("Client", invoice.clientName || "—");
  addLine("Nom du projet", invoice.projectName || invoice.projectId || "—");
  addLine("Project ID / Projet ID", invoice.projectId || "—");
  addLine("Statut", invoice.status);
  addLine("Montant", formatCurrency(invoice.amount));
  addLine("Date d'emission", formatDate(invoice.issueDate));
  addLine("Date d'echeance", formatDate(invoice.dueDate));
  addLine("Services", serviceLabels.length ? serviceLabels.join(", ") : "—");

  if (invoice.notes?.trim()) {
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const wrappedNotes = doc.splitTextToSize(invoice.notes.trim(), 180);
    doc.text(wrappedNotes, 14, y);
  }

  const fileName = `invoice-${invoice.invoiceNumber || invoice._id}.pdf`;
  doc.save(fileName);
}
