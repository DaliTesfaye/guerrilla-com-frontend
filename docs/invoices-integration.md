# Invoice Feature (Frontend Integration)

## 1. Goal

Integrate invoice management in the dashboard using the already completed backend.

Main objectives:
- generate invoices from project context
- preview invoice data
- download invoice as PDF
- manage invoice statuses

---

## 2. Main Workflow

```txt
Dashboard
  -> Projects
    -> Project Details
      -> Generate Invoice
        -> Invoice Preview
          -> Download PDF
```

---

## 3. Frontend Routes

1. Invoices list: `/dashboard/invoices`
2. Invoice details: `/dashboard/invoices/:id`
3. Create invoice from project: `/dashboard/projects/:projectId/invoices/create`

Notes:
- `projectId` comes automatically from route params in contextual create flow.

---

## 4. Invoice Type

```ts
type InvoiceStatus = "draft" | "sent" | "paid";

type Invoice = {
  _id: string;
  invoiceNumber: string;
  projectId: string;
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
```

---

## 5. Invoice List Page

Display:
1. invoice number
2. client name
3. project name
4. amount
5. status
6. issue date

Actions:
1. preview
2. download PDF
3. edit
4. delete

---

## 6. Invoice Details Page

Display:
1. agency information
2. client information
3. linked project
4. services list
5. invoice amount
6. issue date
7. due date
8. status
9. notes

---

## 7. Generate Invoice Flow

Inside `/dashboard/projects/:id`, add:
1. Generate Invoice button
2. Related invoices section

On create:
1. project data is auto-filled
2. admin edits fields if needed
3. submit invoice

---

## 8. Form Requirements

Required:
1. invoiceNumber
2. amount
3. issueDate
4. status

Optional:
1. dueDate
2. notes

Do not manually ask for:
1. `projectId` in contextual route
2. `clientName` if auto-filled

---

## 9. API Integration

Use backend endpoints:
1. `POST /api/invoices`
2. `GET /api/invoices`
3. `GET /api/invoices/:id`
4. `PATCH /api/invoices/:id`
5. `DELETE /api/invoices/:id`

---

## 10. PDF Download

Add:
1. Download PDF button on invoice details page

Suggested libraries:
1. jsPDF
2. react-pdf

MVP focus:
1. clean, simple invoice PDF

---

## 11. UI Requirements

Add:
1. status badges
2. loading states
3. empty states
4. delete confirmation
5. amount formatting
6. date formatting

---

## 12. Role-Based UI

Only `admin` and `super_admin` can:
1. create invoices
2. edit invoices
3. delete invoices

---

## 13. Current Priority

Focus on:
1. invoice pages
2. project integration
3. invoice preview
4. PDF download
5. CRUD integration
