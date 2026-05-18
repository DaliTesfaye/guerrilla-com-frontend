# Frontend Participation Roadmap

## Purpose
Single reference for frontend implementation of the participation/dashboard feature set, split into **Now** and **Later**.

---

## Current Backend Endpoints

### Participants Dashboard (admin/super_admin)
- `GET /api/dashboard/participants`
- Query params (optional):
  - `projectId`
  - `eventId`
  - `q` (search by name or email)
  - `search` (alias of `q`)

Response:
- `participants[]`: `name`, `email`, `eventTitle`, `projectName`, `service`, `participatedAt`, ids
- `stats`: `totalParticipants`, `totalParticipatingEvents`, `mostActiveEvent`, `mostActiveProject`

### Participation Create (public)
- `POST /api/events/:eventId/participate`

### Projects for filter options
- `GET /api/projects`

### Events for filter options
- `GET /api/events` (response shape: `{ message, events }`)

---

## NOW (Implement Immediately)

## 1) Sidebar + Route
- Add sidebar item: `/dashboard/participants`
- Restrict page to `admin` / `super_admin`

## 2) Participants Dashboard Page
- Show list (table/cards) with:
  - Name
  - Email
  - Event title
  - Project name
  - Service
  - Participation date/time

## 3) Search + Filters
- Search input using `q` (name or email)
- Filters:
  - by project
  - by event
- Keep filter/search state in URL query params

## 4) Stats Cards
- Total participants
- Total participating events
- Most active event
- Most active project

## 5) UX States
- Loading state
- Empty state
- Error state (401/403/500)

## 6) Acceptance Checklist (NOW)
- [ ] Page loads dashboard data successfully
- [ ] Search by name/email works
- [ ] Project filter works
- [ ] Event filter works
- [ ] Stats update with filters/search
- [ ] Unauthorized users cannot access page

---

## LATER (Backlog)

## 1) CSV Export
- Add export button in dashboard UI
- Wire to backend export endpoint when available

## 2) Advanced Filters
- By service
- By date range

## 3) Extra Columns/Badges
- Game played
- Participation status

## 4) Participation Analytics UI
- Trend charts
- Attendance insights
- Event/project comparison views

## 5) Notification Integrations
- Reminder-related UI actions (when backend supports it)

---

## Implementation Notes
- Debounce search input (300-500ms recommended)
- Format `participatedAt` in local timezone
- Use backend `message` fields for toast feedback where useful

