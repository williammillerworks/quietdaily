# Quieted - Daily Memo Web Application

**Version:** 1.0  
**Author:** William Miller  
**Date:** 2025-06-28  
**Platform:** Responsive Web Application  
**Status:** ✅ Completed and Deployed

---

## Overview

Quieted is a minimalist daily memo web application that allows users to create exactly one memo per day. Built with a clean, responsive design, the app encourages mindful daily reflection through intentional writing. Users authenticate with Google OAuth and can create daily entries containing a title, optional link, and content.

---

## ✅ Implemented Features

### Authentication System
- **Google OAuth 2.0**: Secure authentication using Google accounts
- **Session Management**: Persistent user sessions with automatic login state
- **Clean Login Flow**: Simple "Log in" button that redirects to Google authentication

### Daily Memo Functionality
- **One Memo Per Day**: Users can create or edit only one memo per calendar day
- **Auto-Date Assignment**: Today's date is automatically set for new memos
- **Required Fields**: Title and content are mandatory; link is optional
- **Real-time Save State**: Save button is enabled only when required fields are filled

### User Interface
- **"Quieted" Branding**: Clean, minimal header with app name
- **Mobile-First Design**: Responsive layout with 800px max width on desktop
- **Memo List View**: Shows current and previous memos in chronological order
- **Entry Prompt**: "Enter today's daily" call-to-action when no memo exists for today
- **Form Interface**: Clean input fields matching the provided design mockups

### Technical Architecture
- **Frontend**: React with TypeScript, Vite for bundling
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with responsive design
- **State Management**: TanStack Query for server state

---

## Database Schema

### Users Table
```sql
- id (serial, primary key)
- googleId (text, unique)
- email (text, unique)
- name (text)
- givenName (text, optional)
- picture (text, optional)
- accessToken (text, optional)
- refreshToken (text, optional)
- createdAt (timestamp)
- lastSignIn (timestamp)
```

### Sessions Table
```sql
- id (text, primary key)
- userId (foreign key to users)
- expiresAt (timestamp)
- createdAt (timestamp)
```

### Daily Memos Table
```sql
- id (serial, primary key)
- userId (foreign key to users)
- title (text, required)
- date (text, format: YYYY-MM-DD, required)
- link (text, optional)
- content (text, required)
- createdAt (timestamp)
- updatedAt (timestamp)
```

---

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Logout user

### Daily Memos
- `GET /api/memos` - Get all user memos
- `GET /api/memos/:date` - Get memo for specific date
- `POST /api/memos` - Create or update memo for today

---

## User Journey

1. **Landing Page**: User sees "Quieted" header with "Enter today's daily" prompt
2. **Authentication**: Clicking prompts Google OAuth login
3. **Memo Creation**: Authenticated users can create today's memo with:
   - Title (required)
   - Current date (auto-set)
   - Link (optional)
   - Content (required)
4. **Save & Return**: Valid memos save automatically and return to main list
5. **Memo History**: Users can view and edit previous memos

---

## Design Specifications

### Mobile-First Responsive
- Mobile: Full width with padding
- Desktop: Maximum 800px width, centered
- Clean typography using system fonts
- Minimal color palette (grays and black)

### Component Styling
- Input fields with bottom borders (no box borders)
- Gray placeholder text
- Hover states for interactive elements
- Dark save button when form is valid
- Back arrow navigation

---

## Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Google OAuth credentials

### Environment Variables
```
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Installation & Running
```bash
npm install
npm run db:push  # Apply database schema
npm run dev      # Start development server
```

---

## Deployment

The application is configured for Replit deployment with:
- **Autoscale**: Automatic scaling based on traffic
- **Port Configuration**: External port 80 → internal port 5000
- **Database**: PostgreSQL 16 module integration
- **Environment**: Production-ready with secure session management

---

## Technical Decisions

### Why Express.js + React?
- Familiar stack for rapid development
- Strong TypeScript support throughout
- Excellent ecosystem for authentication and database integration

### Why PostgreSQL + Drizzle?
- Relational data model fits memo structure perfectly
- Type-safe database operations with Drizzle ORM
- Easy migrations and schema management

### Why Google OAuth Only?
- Simplifies authentication complexity
- Most users already have Google accounts
- Reduces password management burden

---

## Future Enhancements

### Potential Features (Not Implemented)
- Markdown rendering for memo content
- Export memos to various formats
- Dark mode theme support
- Public memo sharing with links
- Edit window restrictions (e.g., until midnight)
- Streak tracking for consistent daily writing

---

## Project Status

✅ **Completed Features:**
- Google OAuth authentication system
- Daily memo CRUD operations
- Responsive UI matching design specifications
- One memo per day enforcement
- PostgreSQL database integration
- Production-ready deployment configuration

🎯 **Current State:** Fully functional daily memo application ready for users

---

**Built with ❤️ by William Miller - 2025**