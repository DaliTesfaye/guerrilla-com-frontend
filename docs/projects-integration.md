# Projects Integration (Frontend)

## 1. Goal

Adapt the dashboard Projects module to the new backend architecture where:

- A project is a campaign container
- A project owns related events
- Event creation should happen from inside a project context

Target flow:

`Projects -> Project Details -> Related Events -> Create Event`

---

## 2. Current Frontend State (Gap Analysis)

### 2.1 Already implemented

1. `GET /projects` list page (`/dashboard/projects`)
2. `POST /projects` create page (`/dashboard/projects/create`)
3. Basic schema: `name`, `description`, `status`
4. Table-based list UI

### 2.2 Missing compared to new backend

1. New project fields (`clientName`, `budget`, `startDate`, `endDate`, `image`)
2. New status values (`planned`, `active`, `completed`)
3. Project details page (`/dashboard/projects/:id`)
4. Edit project page (`/dashboard/projects/:id/edit`)
5. Delete project action
6. Related events section inside project details
7. Event creation inside project context (`/dashboard/projects/:projectId/events/create`)
8. API migration to new dashboard endpoints (`/api/dashboard/projects...`)

---

## 3. Backend Contract to Follow

### 3.1 Project type

```ts
type Project = {
  _id: string;
  name: string;
  description: string;
  clientName: string;
  budget?: number;
  status: "planned" | "active" | "completed";
  startDate: string;
  endDate: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 3.2 Endpoints

1. `GET /dashboard/projects`
2. `GET /dashboard/projects/:id`
3. `POST /dashboard/projects`
4. `PATCH /dashboard/projects/:id`
5. `DELETE /dashboard/projects/:id`
6. `POST /dashboard/projects/:projectId/events`

---

## 4. Required Frontend Routes

1. `/dashboard/projects` - list + management entrypoint
2. `/dashboard/projects/create` - create project
3. `/dashboard/projects/:id` - project details + related events
4. `/dashboard/projects/:id/edit` - edit project
5. `/dashboard/projects/:projectId/events/create` - create event in selected project

---

## 5. Feature Requirements

### 5.1 Projects list page

1. Move from table-only to card-first layout (responsive grid)
2. Each card shows:
   - image (optional)
   - name
   - clientName
   - budget
   - status badge
   - start/end dates
3. Card actions:
   - Open project
   - Edit project
   - Delete project
4. Empty state: "No projects found" + CTA to create

### 5.2 Project details page

1. Header block:
   - image, title, clientName, status, budget
2. Information block:
   - description, startDate, endDate, timestamps
3. Statistics block (placeholder allowed):
   - total events
   - active events
   - total participants
4. Related events block:
   - list linked events
   - CTA "Create Event"

### 5.3 Related events cards (inside details)

Each event preview should include:

1. title
2. service badge
3. city
4. date
5. participants count
6. status badge
7. optional game indicator

### 5.4 Event creation in project context

1. Route contains `projectId`
2. `projectId` is auto-used from route params
3. Do not ask admin to manually select project

### 5.5 Create / edit project forms

Required fields:

1. name
2. description
3. clientName
4. status
5. startDate
6. endDate

Optional fields:

1. budget
2. image (URL only)

Validation:

1. Required fields must be present
2. `endDate >= startDate`
3. `budget` numeric if provided
4. Edit supports partial updates

---

## 6. API Layer Changes

Create dashboard project API methods that match backend:

1. `getProjects()`
2. `getProjectById(id)`
3. `createProject(payload)`
4. `updateProject(id, payload)`
5. `deleteProject(id)`
6. `createProjectEvent(projectId, payload)`

Notes:

1. Use authenticated dashboard client (`api` axios instance)
2. Normalize response shape centrally to avoid page-level parsing issues

---

## 7. UX, Loading, and Error States

1. Loading:
   - spinner/skeleton for list/details/forms
2. Errors:
   - show backend message when available
3. Empty states:
   - no projects
   - no related events in project details
4. Retry:
   - allow retry for failed fetch states where relevant

---

## 8. Authorization UI Rules

Show management actions only to authorized roles:

1. Create
2. Edit
3. Delete

Restricted actions must be hidden in UI for unauthorized users.

---

## 9. Image Strategy

For this phase:

1. Use image URL field only
2. Keep image optional
3. No file upload flow yet

---

## 10. Implementation Phases (What We Will Build)

### Phase 1 - Data and schema migration

1. Update project types and zod schemas
2. Replace old status enum with `planned | active | completed`
3. Move API calls to `/projects...`

### Phase 2 - Project CRUD routes

1. Upgrade create form to new fields
2. Add edit page and update flow
3. Add delete action on list/details

### Phase 3 - Project details + events linkage

1. Build `/projects/:id`
2. Add related events section
3. Add `/projects/:projectId/events/create` flow with auto project context

### Phase 4 - UX polish and safeguards

1. Improve card layout + responsive behavior
2. Complete loading/error/empty states
3. Verify role-based action visibility

---

## 11. Immediate Priority

1. Migrate to new project schema and endpoints
2. Build project details page
3. Connect related events to project details
4. Enable event creation from project context
