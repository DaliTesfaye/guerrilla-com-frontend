# Frontend Integration Guide - Send Reminders Feature

## API Endpoint Reference

```
POST /api/events/:eventId/send-reminders
Header: Authorization: Bearer {user-token}

Response: 
{
  "success": true,
  "sent": 5,
  "failed": 0,
  "message": "Reminders sent successfully. Sent: 5, Failed: 0"
}

Error Response:
{
  "message": "Event not found" // or other error messages
}
```

---

## Task 1️⃣: Create API Service Function

**File:** `src/services/api.ts` (or your API service file)

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Send reminders to all participants of an event
 * @param eventId - The ID of the event
 * @returns Promise with sent and failed counts
 */
export const sendReminders = async (eventId: string) => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  
  const response = await fetch(
    `${API_BASE_URL}/events/${eventId}/send-reminders`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send reminders");
  }

  return await response.json();
};
```

---

## Task 2️⃣: Add Button to Event Details Page

**Where:** Event details component (wherever you show event info)

```typescript
import { useState } from "react";
import { sendReminders } from "@/services/api";
import { useToast } from "@/hooks/useToast"; // or your toast library

export const EventDetails = ({ eventId, userRole }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSendReminders = async () => {
    setLoading(true);
    try {
      const result = await sendReminders(eventId);
      
      // Show success toast
      showToast({
        type: "success",
        message: `Reminders sent successfully! Sent: ${result.sent}, Failed: ${result.failed}`,
      });
    } catch (error) {
      // Show error toast
      showToast({
        type: "error",
        message: error.message || "Failed to send reminders",
      });
    } finally {
      setLoading(false);
    }
  };

  // Only show button to admin
  if (userRole !== "ADMIN") return null;

  return (
    <div className="event-details">
      {/* Other event details... */}
      
      <button 
        onClick={handleSendReminders}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Sending..." : "📧 Send Reminders to All"}
      </button>
    </div>
  );
};
```

---

## Task 3️⃣: Add Button to Participants Dashboard

**Where:** Participants list header or toolbar

```typescript
import { useState } from "react";
import { sendReminders } from "@/services/api";
import { useToast } from "@/hooks/useToast";

export const ParticipantsDashboard = ({ eventId, participants, userRole }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSendReminders = async () => {
    setLoading(true);
    try {
      const result = await sendReminders(eventId);
      
      showToast({
        type: "success",
        message: `Reminders sent successfully! Sent: ${result.sent}, Failed: ${result.failed}`,
      });
    } catch (error) {
      showToast({
        type: "error",
        message: error.message || "Failed to send reminders",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="participants-container">
      {/* Toolbar with Send Reminders Button */}
      <div className="participants-toolbar">
        <h2>Participants ({participants.length})</h2>
        
        {/* Send Reminders Button - Admin Only */}
        {userRole === "ADMIN" && (
          <button 
            onClick={handleSendReminders}
            disabled={loading}
            className="btn btn-success"
          >
            {loading ? (
              <>
                <Spinner size="sm" /> Sending...
              </>
            ) : (
              "📧 Send Reminders"
            )}
          </button>
        )}
      </div>

      {/* Participants List */}
      <div className="participants-list">
        {participants.map((participant) => (
          <div key={participant._id} className="participant-item">
            <p><strong>{participant.name}</strong></p>
            <p>{participant.email}</p>
            <p className="text-muted">Joined: {new Date(participant.participatedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Task 4️⃣: Error Handling

Handle these error scenarios gracefully:

```typescript
const handleSendReminders = async () => {
  setLoading(true);
  try {
    const result = await sendReminders(eventId);
    showToast({
      type: "success",
      message: `Reminders sent! Sent: ${result.sent}, Failed: ${result.failed}`,
    });
  } catch (error: any) {
    let errorMessage = "Failed to send reminders";
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      errorMessage = "Event not found. Please refresh the page.";
    } else if (error.response?.status === 401) {
      errorMessage = "You are not authorized to send reminders. Admin access required.";
    } else if (error.response?.status === 500) {
      errorMessage = "Server error. Please try again later.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showToast({
      type: "error",
      message: errorMessage,
    });
  } finally {
    setLoading(false);
  }
};
```

---

## Task 5️⃣: Loading State

Implement proper loading feedback:

```typescript
// Disable button during API call
<button 
  onClick={handleSendReminders}
  disabled={loading}  // Button is disabled while loading
  className="btn btn-primary"
>
  {loading ? (
    <>
      <Spinner size="sm" className="mr-2" />
      Sending Reminders...
    </>
  ) : (
    "📧 Send Reminders"
  )}
</button>

// Optional: Show a loading overlay
{loading && (
  <div className="loading-overlay">
    <p>Sending reminders to {participantsCount} participants...</p>
  </div>
)}
```

---

## Task 6️⃣: Success Toast Message

Display confirmation with send statistics:

```typescript
showToast({
  type: "success",
  title: "Reminders Sent!",
  message: `Successfully sent reminders to ${result.sent} participant(s).${
    result.failed > 0 ? ` (${result.failed} failed)` : ""
  }`,
  duration: 4000, // Show for 4 seconds
});
```

---

## Task 7️⃣: Role-Based Visibility

Only show the button to admin users:

```typescript
// In your component
import { useAuth } from "@/hooks/useAuth"; // or your auth context

export const EventActions = ({ eventId }) => {
  const { user } = useAuth();
  
  // Only render for admin users
  if (user?.role !== "ADMIN") {
    return null; // Don't render button
  }

  return (
    <button onClick={handleSendReminders}>
      Send Reminders
    </button>
  );
};
```

---

## Implementation Checklist

- [ ] Create `sendReminders()` API service function in `src/services/api.ts`
- [ ] Add "Send Reminders" button to Event Details page
- [ ] Add "Send Reminders" button to Participants Dashboard
- [ ] Implement loading state (disable button, show spinner)
- [ ] Show success toast with sent/failed count
- [ ] Show error toast on failure with specific error handling
- [ ] Add role check - only show button to admin users
- [ ] Test with real event and participants
- [ ] Test error scenarios (unauthorized, event not found, server error)
- [ ] Verify emails are received after clicking button

---

## Testing the Integration

### Test Case 1: Successful Send
1. Login as admin
2. Go to event details or participants page
3. Click "Send Reminders" button
4. Should see loading state (spinner, disabled button)
5. Should see success toast: "Reminders sent! Sent: X, Failed: 0"
6. Check email inbox to verify reminder was received

### Test Case 2: Error Handling
1. Try to send reminders without admin role
2. Should see error toast: "You are not authorized to send reminders"

### Test Case 3: Event Not Found
1. Try with non-existent eventId
2. Should see error toast: "Event not found"

### Test Case 4: No Participants
1. Create event with no participants
2. Send reminders
3. Should show: "Reminders sent! Sent: 0, Failed: 0"

---

## API Behavior Notes

- **Authentication Required:** All requests must include valid JWT token in Authorization header
- **Admin Only:** Only users with role "ADMIN" can access this endpoint
- **Async Processing:** Reminders are sent one by one. If one fails, others continue.
- **No Response Wait:** The endpoint returns immediately with count of successes/failures
- **Rate Limiting:** Consider implementing rate limiting to prevent abuse

---

## Environment Variables

Add to your `.env.local` (frontend):

```
REACT_APP_API_URL=http://localhost:5000/api
```

Or if using a different API:
```
REACT_APP_API_URL=https://api.guerilla-com.com/api
```

---

## Support

**Backend Endpoint:** `POST /api/events/:eventId/send-reminders`  
**Backend Status:** ✅ Ready and tested  
**Email Service:** ✅ SendGrid configured  
**Documentation:** See backend logs for troubleshooting
