# Quiet Daily — Product Specification

**Version:** 0.1-250626  
**Author:** William Miller  
**Date:** 2025-06-26  
**Platform:** Responsive Web Application

---

## Overview

Quiet Daily is a minimalist, web-based journaling tool designed for intentional daily writing. Users are allowed to submit exactly one memo per day, consisting of a title, a markdown-formatted body, and one link or image. Once submitted, no edits or additional entries are permitted for that day. Entries are stored locally and shown in reverse chronological order. The product encourages mindful daily reflection with no distractions, accounts, or tracking.

---

## Core Features

### Daily Entry Rules

- Each user can submit one memo per calendar day.
- After submission:
  - The input editor is locked.
- Timezone is based on the user's browser (local time) for MVP.

---

## Entry List

- Displayed as the main home page.
- Sorted in reverse chronological order (most recent first).
- Each item shows:
  - Title (with maximum visible characters limited for layout)
  - Date (automatically assigned, formatted as `YYYY-MM-DD`)
- Clicking an item navigates to a full entry detail page with a back button.
- When today’s entry is not yet created, show a special "Enter Today" prompt with distinct design and today’s date.

---

## Entry Description Page

- Displays:
  - Title
  - Date and time
  - One image or link (optional)
  - Content (rendered with Markdown)
- Includes:
  - Share button with public/private toggle
  - Back button to return to entry list

---

## Entry Fields

- **Title**: Short, single-line input (max 100 characters)
- **Additional**: One of the following (either a link or one image)
- **Content**: Multi-line input supporting basic Markdown

### Supported Markdown Features

- Headers (`#`, `##`, `###`)
- Bold / italic
- Lists

---

## Entry Submission

- Save button is enabled only when both title and content are non-empty.
- Upon submission:
  - Entry is stored with timestamp.
  - Page transitions to a entry list with a toast

---

## Authentication(for later feature)

- Google Login (OAuth 2.0) is required.
- Users can write before logging in.
- Authentication is requested only at submission time.
- By default, entries are private and scoped to the user.
- When the user shares a link, the entry becomes publicly viewable (after confirmation).
- Authentication system must:
  - Identify user sessions
  - Prevent unauthorized access to private entries (unless explicitly shared)

---

## Interface Design

### Design Reference

- OpenAI
- Clean, simple and modern.

### List View (Default)

- Displays previous entries with:
  - Title
  - Date
- Fist entry will shows a "Today" at Title and Date if today's entry is missing.
- When "Today" is clicked, editor view is open.
- Mobile-friendly vertical scroll.

### Editor View

- Title input
- Optional input for either link or image
- Markdown content editor
- Save button (disabled until all required fields are filled)

### After Submission (Locked State)

- Displays message: "Your memo for today has been saved."
- Optionally shows today's entry as a read-only preview.

---

## Data Model

### Entry

```json
{
  "user_id": "abc123",
  "date": "2025-06-25",
  "time": "08:15",
  "title": "A Quiet Morning",
  "additional": "https://example.com",
  "content": "# Thoughts\nToday I woke up early and..."
}
```

### User

- Identified via Google account ID (OAuth subject) for next scope
- No passwords or usernames
- No public profiles in MVP

---

## Technical Architecture

### Frontend

- Framework: React (Next.js preferred)
- Styling: Tailwind CSS
- Markdown Renderer: `react-markdown`, `remark-gfm`
- Auth: `next-auth` with Google provider

### Backend

- Database: Firestore, Supabase, or similar
- Middleware to enforce:
  - One-entry-per-day
  - Authentication for data access

### Deployment

- Platform: Vercel
- Environment Config:
  - Google OAuth credentials
  - Secure API keys

---

## Scope

### MVP Includes

- Google login
- One memo per day rule
- Markdown editor
- Entry detail page
- Entry list (reverse chronological)
- Public sharing
- Responsive layout

### MVP Excludes

- Editing previous entries
- Deleting entries
- Notifications or reminders

---

## Future Enhancements

- Edit window (allowed until midnight)
- Streak tracking
- Export entries to Markdown
- Optional themes (e.g., dark mode)
- Mobile wrapper (PWA)

---

## Next Steps

1. Initialize Next.js + Tailwind project
2. Implement Google login (next-auth)
3. Build basic Markdown editor
4. Create entry submission + lock logic
5. Display list of past entries

---
