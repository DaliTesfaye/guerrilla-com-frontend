import api from "@/lib/api";

export type InvoiceStatus = "draft" | "sent" | "paid";

export type InvoiceItem = {
  _id: string;
  invoiceNumber: string;
  projectId: string;
  projectName?: string;
  clientName: string;
  services: string[];
  amount: number;
  issueDate: string;
  dueDate?: string;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type InvoicesListResponse = {
  invoices?: unknown[];
  data?: unknown[];
};

type InvoiceItemResponse = {
  invoice?: unknown;
  data?: unknown;
};

function normalizeInvoice(raw: unknown): InvoiceItem {
  const maybe = (raw || {}) as Partial<InvoiceItem> & {
    project?: { _id?: string; name?: string };
  };

  return {
    _id: maybe._id || "",
    invoiceNumber: maybe.invoiceNumber || "",
    projectId:
      (typeof maybe.projectId === "string" ? maybe.projectId : undefined) ||
      maybe.project?._id ||
      "",
    projectName: maybe.projectName || maybe.project?.name || undefined,
    clientName: maybe.clientName || "",
    services: Array.isArray(maybe.services) ? maybe.services : [],
    amount: typeof maybe.amount === "number" ? maybe.amount : 0,
    issueDate: maybe.issueDate || "",
    dueDate: maybe.dueDate,
    status: (maybe.status as InvoiceStatus) || "draft",
    notes: maybe.notes,
    createdAt: maybe.createdAt || "",
    updatedAt: maybe.updatedAt || "",
  };
}

function extractInvoices(data: unknown): InvoiceItem[] {
  if (Array.isArray(data)) {
    return data.map(normalizeInvoice);
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const maybe = data as InvoicesListResponse;
  if (Array.isArray(maybe.invoices)) {
    return maybe.invoices.map(normalizeInvoice);
  }
  if (Array.isArray(maybe.data)) {
    return maybe.data.map(normalizeInvoice);
  }

  return [];
}

function extractInvoice(data: unknown): InvoiceItem {
  if (data && typeof data === "object" && "_id" in data) {
    return normalizeInvoice(data);
  }

  const maybe = (data || {}) as InvoiceItemResponse;
  if (maybe.invoice) {
    return normalizeInvoice(maybe.invoice);
  }
  if (maybe.data) {
    return normalizeInvoice(maybe.data);
  }

  throw new Error("Invalid invoice response");
}

export async function getInvoices(): Promise<InvoiceItem[]> {
  const res = await api.get("/invoices");
  return extractInvoices(res.data);
}

export async function getInvoiceById(invoiceId: string): Promise<InvoiceItem> {
  const res = await api.get(`/invoices/${invoiceId}`);
  return extractInvoice(res.data);
}

export type CreateInvoicePayload = {
  invoiceNumber: string;
  projectId: string;
  clientName: string;
  services?: string[];
  amount: number;
  issueDate: string;
  dueDate?: string;
  status: InvoiceStatus;
  notes?: string;
};

export type UpdateInvoicePayload = Partial<CreateInvoicePayload>;

export async function createInvoice(payload: CreateInvoicePayload): Promise<InvoiceItem> {
  const res = await api.post("/invoices", payload);
  return extractInvoice(res.data);
}

export async function updateInvoice(
  invoiceId: string,
  payload: UpdateInvoicePayload
): Promise<InvoiceItem> {
  const res = await api.patch(`/invoices/${invoiceId}`, payload);
  return extractInvoice(res.data);
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  await api.delete(`/invoices/${invoiceId}`);
}

export async function getInvoicesByProjectId(projectId: string): Promise<InvoiceItem[]> {
  const invoices = await getInvoices();
  return invoices.filter((invoice) => invoice.projectId === projectId);
}
