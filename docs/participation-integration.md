# 🎯 Frontend Integration – Events Participation

## 📌 Objective

Connect the existing frontend (modal already created) with backend APIs to allow users to participate in events and display participants count.

---

# 🟩 1. BACKEND ENDPOINTS

## 🔹 Participate in event

**POST** `/api/events/:eventId/participate`

### Body:

```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

## 🔹 Get participants count

**GET** `/api/events/:eventId/participants-count`

### Response:

```json
{
  "participantsCount": 1
}
```

---

# 🟩 2. FRONTEND TASKS

## 📌 A. CONNECT PARTICIPATION FORM (MODAL)

The modal is already created.

### ✅ What to implement:

* On form submit:

  * Send POST request to `/participate`
  * Pass:

    * email (required)
    * name (optional)

---

### 🔄 Flow:

```text
User submits form
→ Send POST request
→ If success:
    - Show success message
    - Close modal
    - Refresh participants count
→ If error:
    - Show error message
```

---

## 🟩 3. HANDLE RESPONSES

### ✅ Success

Show message:

```text
Participation enregistrée ✅
```

---

### ❌ Duplicate participation

```text
Vous avez déjà participé
```

---

### ❌ Validation error

```text
Email invalide
```

---

# 🟩 4. FETCH PARTICIPANTS COUNT

## 📌 When to fetch:

* On page load (for each event)
* After successful participation

---

## 📌 What to do:

* Call:

```http
GET /api/events/:eventId/participants-count
```

* Store result in state

---

# 🟩 5. DISPLAY IN EVENT CARD

## 📌 Add this inside event card UI:

```text
👥 {participantsCount} participants
```

---

## 💡 UI Tips

* Small text under event title
* Or badge style
* Keep it clean and readable

---

# 🟩 6. STATE MANAGEMENT

For each event:

* participantsCount (number)
* loading state (optional)

---

# 🟩 7. OPTIONAL IMPROVEMENT

Instead of calling count API per event:

👉 If backend supports it:

* Include `participantsCount` in `/api/events`

---

# 🟩 8. IMPORTANT RULES

* Do NOT increment count manually in frontend
* Always rely on backend response
* Always refresh count after participation

---

# 🎯 FINAL FLOW

```text
User opens event
→ Sees participants count

User clicks Participate
→ Modal opens

User submits form
→ POST request

If success:
→ Close modal
→ Refetch count
→ UI updates
```

---

# 📌 NOTES

* Keep UI responsive
* Handle loading & errors properly
* Follow backend API strictly
