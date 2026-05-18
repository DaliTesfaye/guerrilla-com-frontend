# Events Integration (Frontend)

## 1. Goal

Migrate dashboard and public Events frontend to match the current backend schema and response shapes, while keeping role-based management and consistent UI behavior.

Primary architecture:

`Projects -> Project Details -> Related Events -> Create Event`

---

## 2. Current Frontend Gap Analysis

### 2.1 What exists now

1. Dashboard events list (`/dashboard/events`)
2. Dashboard create event (`/dashboard/events/create`)
3. Public events + participation flow
4. Participants count endpoint integration

### 2.2 What is outdated or missing

1. Old event fields are still used in forms/pages (`name`, `type`)
2. New required fields are not covered (`title`, `service`, `projectId`, `city`, `location`, etc.)
3. API response parsing is not normalized for wrapped payloads (`{ events }`, `{ event }`)
4. No event details page
5. No event edit page
6. No event delete flow
7. No project-aware event creation as the main workflow

---

## 3. Backend Contract (Source of Truth)

### 3.1 Event type

```ts
type EventStatus = "draft" | "planned" | "ongoing" | "completed";

type Event = {
  _id: string;
  title: string;
  description: string;
  service: string;
  projectId: string;
  status: EventStatus;
  date: string;
  city: string;
  location: string;
  image?: string;
  maxParticipants?: number;
  participantsCount: number;
  hasGame: boolean;
  gameName?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 3.2 Endpoints

1. `POST /api/events` (admin or super_admin)
2. `GET /api/events` (public)
3. `GET /api/events/:id` (public)
4. `PATCH /api/events/:id` (admin or super_admin)
5. `DELETE /api/events/:id` (admin or super_admin)
6. `GET /api/events/:id/participants-count` (public)

Supporting data for form selects:

1. `GET /api/projects`
2. `GET /api/services`

---

## 4. UI Validation Rules

Required:

1. `title`
2. `service`
3. `projectId`
4. `status`
5. `date`
6. `city`
7. `location`

Rules:

1. `service` must exist in values loaded from `/api/services`
2. `maxParticipants >= 0` when provided
3. `gameName` is required when `hasGame === true`
4. `participantsCount` must never be sent by frontend

---

## 5. Route Strategy

### 5.1 Main workflow (project context first)

1. `/dashboard/projects/:id/events/create`
   - `projectId` is taken automatically from route params
   - No manual project selector in this contextual route

### 5.2 Global events management

1. `/dashboard/events` (list + management actions)
2. `/dashboard/events/create` (optional global create with project selector)
3. `/dashboard/events/:id` (details)
4. `/dashboard/events/:id/edit` (edit)

---

## 6. Page Requirements

### 6.1 Events list page

Display at minimum:

1. `title`
2. `service`
3. `date`
4. `city`
5. `location`
6. `status`
7. `participantsCount`

Add actions (for authorized roles):

1. Open details
2. Edit
3. Delete

### 6.2 Event details page

Display full event information including:

1. core identity (title, description, service, status)
2. scheduling/location (date, city, location)
3. engagement (participantsCount, maxParticipants)
4. game info (`hasGame`, `gameName`)
5. image with fallback when missing

### 6.3 Create/edit forms

Inputs:

1. `title`
2. `description`
3. `service` (select)
4. `projectId` (select, except contextual project route)
5. `status` (draft/planned/ongoing/completed)
6. `date`
7. `city`
8. `location`
9. `image` (optional URL)
10. `maxParticipants` (optional)
11. `hasGame` (toggle/checkbox)
12. `gameName` (conditional)

---

## 7. API Layer Requirements

Create a normalized events API module with:

1. `getEvents()`
2. `getEventById(id)`
3. `createEvent(payload)`
4. `updateEvent(id, payload)`
5. `deleteEvent(id)`
6. `getEventParticipantsCount(id)`

Normalization rules:

1. Accept array or wrapped list (`events`, `data`)
2. Accept wrapped item (`event`, `data`) for single fetch and write responses
3. Return consistent typed objects to pages

---

## 8. Role-Based UI

1. `admin` and `super_admin` can create/update/delete
2. Unauthorized roles only see read-only pages/sections
3. Hide restricted action buttons from UI

---

## 9. UX and Consistency Requirements

1. Empty states:
   - no events in global list
   - no events linked to project
2. Loading states on list/details/forms
3. Backend message display for `400`, `403`, `404`, `429`
4. Consistent status badges for `draft/planned/ongoing/completed`
5. Shared date formatting strategy across dashboard/public cards
6. Image fallback to avoid broken layouts

---

## 10. Reusability Targets

1. Reusable `EventCard` component
2. Shared status badge helper/component
3. Shared date formatter utility
4. Shared services source for labels/options (from API, optionally cached in state)

---

## 11. Implementation Plan (Phased)

### Phase 1 - Data layer and schema migration

1. Refactor events API layer to new event contract
2. Update event zod schemas (create and update)
3. Add conditional validation for `hasGame/gameName`

### Phase 2 - Create/edit experience

1. Rebuild create form with full fields
2. Add project-context create route behavior
3. Build edit form with prefilled data

### Phase 3 - Listing and details

1. Migrate list page to new fields and actions
2. Add details page
3. Add delete flow with confirmation and UI refresh

### Phase 4 - Consistency and hardening

1. Add reusable EventCard/status/date helpers
2. Apply role-gated action rendering
3. Finalize loading/error/empty states and QA checklist

---

## 12. QA Checklist

1. Create event with valid payload
2. Reject invalid `service`
3. Reject invalid/non-existing `projectId`
4. Reject when `hasGame = true` and `gameName` missing
5. Update event status and location
6. Delete event
7. Verify list/details/participants count values render correctly
