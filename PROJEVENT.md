# 🎯 Frontend Implementation – Projects & Events (FINAL MVP)

## 🎯 Objective

Build UI for Projects and Events using the **existing backend models** (simple version).

⚠️ Important:

* DO NOT add extra fields
* STRICTLY follow backend schema

---

# 🧠 BACKEND MODELS (FINAL)

## 🟦 Project

```ts
name: string
description: string
status: string (enum)
createdAt: Date
updatedAt: Date
```

---

## 🟩 Event

```ts
name: string
date: Date
type: string
createdAt: Date
updatedAt: Date
```

---

# 🟦 PROJECTS FEATURE

## ✅ Pages

```text
/dashboard/projects
/dashboard/projects/create
```

---

## 📄 Projects List Page

### Requirements

* Fetch from: GET `/api/projects`
* Display in a modern table

---

### Table Columns

* Name
* Description
* Status
* Created At

---

---

## ➕ Create Project Page

### Form Fields

* name (required)
* description (optional)
* status (select)

---

### Behavior

* POST `/api/projects`
* Redirect after success
* Show success/error message

---

---

✅ Pages to Create
/dashboard/events
/dashboard/events/create
📄 Events List Page (IMPORTANT UI CHANGE)
❌ Do NOT use:
Tables
Large cards (like public website)
✅ Use: Row Card List (Hybrid List UI)

Display events as a vertical list of rows, each row styled like a card.

🧩 Each Row Must Display:
Event name (bold)
Date
Type (as badge)
CreatedAt (optional, smaller text)
🎨 UI Structure (per row)
--------------------------------------------------------
Event Name        Date        Type Badge        CreatedAt
--------------------------------------------------------
🎨 Design Rules
Use flex layout (flex justify-between items-center)
Add padding and spacing
Add border or subtle shadow
Rounded corners
Hover effect (highlight row)
✨ UX Behavior
Clean and compact (easy to scan multiple events)
Modern dashboard look (not like a table)
Responsive layout
➕ Top Section

Add:

Button: "Add Event" → redirect to /dashboard/events/create
📡 Data Fetching
GET /api/events
➕ Create Event Page
Form Fields
name (required)
date (required)
type (optional)
Behavior
POST /api/events
Redirect to /dashboard/events after success
Show success/error message
🎯 GOAL
Provide a clean admin experience
Make events easy to scan and manage
Keep UI modern and lightweight
⚠️ IMPORTANT
Do NOT mix with public event cards
Keep admin UI structured and functional
Focus on clarity over design complexity

* DO NOT add:

  * update
  * delete
  * extra fields

* Keep everything simple and clean

---

# 🎯 FINAL GOAL

* Admin can view projects
* Admin can create projects
* Admin can view events
* Admin can create events
* UI looks modern and clean
