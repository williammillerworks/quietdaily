# Quiet Daily — Product Specification

**Version:** 0.1  
**Author:** William Miller  
**Date:** 2025-06-25  
**Platform:** Responsive Web Application

---

## Overview

Quiet Daily is a minimalist, web-based journaling tool designed for intentional daily writing. Users are allowed to submit exactly **one memo per day**, consisting of a title and a markdown-formatted body. Once submitted, no edits or additional entries are permitted for that day. Entries are shown in reverse chronological order, displaying only the title and the date. The product encourages mindful daily reflection with no distractions or features beyond the essentials.

---

## Core Features

### Daily Entry Rules

- Each user can submit **one memo per calendar day**.
- After submission:
  - The input editor is locked.
  - A message like "See you tomorrow" replaces the editor.
- Timezone: Based on user's browser (local time) for MVP.

### Entry Fields

- `title`: short, single-line input (max 100 characters)
- `content`: multi-line input with basic **Markdown support**
  - Rendered output supports:
    - Headers (`#`, `##`, `###`)
    - Bold/italic
    - Lists
    - Links
    - Code blocks

### Entry Submission

- Save button is enabled only when both title and content are non-empty.
- Upon submit:
  - Entry is stored with timestamp.
  - Page transitions to locked state for that day.

---

## Entry List

- Displayed below or on separate page (depending on design).
- Sorted reverse chronologically (most recent first).
- Each item shows:
  - `title`
  - `date` (automatically assigned, formatted as `YYYY-MM-DD`)
- Clicking an item expands to show full markdown-rendered content (optional for MVP).

---

## Authentication

- **Google Login (OAuth 2.0)** is required.
- User must be authenticated before writing or viewing entries.
- Each user’s entries are private and scoped to their account.
- Authentication system must:
  - Identify user session
  - Prevent unauthenticated access to data endpoints

---

## Interface Design

### Editor View (Default State)

- Title input
- Content input area with basic markdown support
- “Save” button (disabled until valid)
- Visual indicator if today’s memo is already submitted

### After Submission (Locked State)

- Message: “Your memo for today has been saved.”
- Optionally: allow preview of today's entry

### List View

- List of previous entries, title + date only
- Optionally expand to view content
- Mobile-friendly vertical scroll

---

## Data Model

### Entry

```json
{
  "user_id": "abc123",
  "date": "2025-06-25",
  "title": "A Quiet Morning",
  "content": "# Thoughts\nToday I woke up early and..."
}
```

### User

- Identified via Google account ID (OAuth subject)
- No username/password
- No public profiles in MVP

---

## Technical Architecture

### Frontend

- Framework: React (Next.js preferred)
- Styling: Tailwind CSS
- Markdown: `react-markdown`, `remark-gfm`
- Authentication: `next-auth` with Google provider

### Backend

- Storage: Firestore, Supabase, or equivalent (MVP-friendly)
- Auth middleware for protecting entry routes
- One-entry-per-day check enforced server-side

### Deployment

- Platform: Vercel
- Environment:
  - OAuth credentials for Google
  - Secure API keys

---

## Scope

### MVP Includes

- Google login
- One memo per day rule
- Markdown editor
- Reverse chronological list of entries
- Responsive layout

### MVP Excludes

- Editing previous entries
- Deleting entries
- Public sharing
- Notifications or reminders

---

## Future Enhancements

- Edit window before midnight
- Streak tracking
- Export all entries to Markdown
- Optional themes (dark mode)
- Private/public toggle for selected entries
- Mobile app wrapper (PWA)

---

## Next Steps

1. Set up GitHub repository: `quiet-daily`
2. Initialize Next.js + Tailwind project
3. Implement Google login (next-auth)
4. Build basic Markdown editor
5. Create entry submission + lock logic
6. Display list of past entries

---
