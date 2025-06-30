# Quieted - Daily Memo Web Application

## Overview

Quieted is a modern daily memo web application built with Express.js, React, and PostgreSQL. It provides secure user authentication using Google OAuth 2.0 and allows users to create one daily memo per day. The application features a clean, minimal design that's mobile-first and responsive (800px max width on desktop), built with shadcn/ui components and following modern development practices.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/bundling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with Google OAuth 2.0 strategy
- **Session Management**: Express sessions with configurable storage
- **API Design**: RESTful endpoints with proper error handling

### Database Architecture
- **Database**: PostgreSQL (configured for both local and cloud deployment)
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Schema Management**: Centralized schema definitions with Zod validation
- **Migration Strategy**: Drizzle Kit for database migrations

## Key Components

### Authentication System
- **Google OAuth Integration**: Complete OAuth 2.0 flow with profile data retrieval
- **Session Management**: Secure session handling with configurable cookies
- **User Management**: Automatic user creation and profile updates
- **Security Features**: CSRF protection, secure cookies in production

### Database Schema
- **Users Table**: Stores Google OAuth profile data, tokens, and timestamps
- **Sessions Table**: Manages user sessions with expiration tracking
- **Daily Memos Table**: Stores daily memo entries with title, date, optional link, and content
- **One Memo Per Day**: Users can create/edit only one memo per day with auto-set dates
- **Type Safety**: Full TypeScript integration with inferred types

### UI Components
- **Design System**: Comprehensive component library with consistent styling
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA-compliant components with keyboard navigation
- **Theme Support**: CSS custom properties for consistent theming

## Data Flow

1. **Authentication Flow**:
   - User initiates Google OAuth login
   - Server handles OAuth callback and creates/updates user record
   - Session is established with secure cookies
   - Client receives user data and updates UI state

2. **API Communication**:
   - React Query manages all server state
   - Centralized API client with error handling
   - Automatic retry logic and caching strategies
   - Type-safe request/response handling

3. **Database Operations**:
   - Drizzle ORM provides type-safe database queries
   - Shared schema ensures consistency across layers
   - Proper transaction handling for data integrity

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **passport-google-oauth20**: Google OAuth 2.0 authentication strategy
- **drizzle-orm**: Modern TypeScript-first ORM
- **@tanstack/react-query**: Server state management for React

### UI Dependencies
- **@radix-ui/react-***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **lucide-react**: Modern icon library

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement and fast refresh
- **Concurrent Development**: Client and server run simultaneously
- **Environment Variables**: Separate configuration for development/production

### Production Build
- **Client Build**: Vite builds optimized React application
- **Server Build**: esbuild bundles Node.js server with external dependencies
- **Static Asset Serving**: Express serves built client files in production

### Replit Configuration
- **Autoscale Deployment**: Configured for automatic scaling
- **Port Configuration**: External port 80 mapped to internal port 5000
- **Module Dependencies**: Node.js 20, Web, and PostgreSQL 16 modules
- **Environment Setup**: Development and production scripts configured

## Changelog

```
Changelog:
- June 27, 2025. Initial setup - Google OAuth authentication system
- June 27, 2025. Added PostgreSQL database integration with Drizzle ORM
- June 27, 2025. Simplified landing page to minimal design with only sign-in button
- June 27, 2025. Fixed OAuth redirect URI mismatch - authentication now working successfully
- June 27, 2025. Updated button to Google-style design with logo and proper styling
- June 28, 2025. Built complete daily memo web app "Quieted" with matching design
- June 28, 2025. Added daily memo database schema (title, date, link, content)
- June 28, 2025. Implemented memo creation/editing form with back button and save functionality
- June 28, 2025. Created "Quieted" landing page with header, memo list, and responsive design
- June 28, 2025. Added one memo per day functionality with auto-set today's date
- June 28, 2025. Full memo CRUD operations with PostgreSQL integration working successfully
- June 29, 2025. Fixed individual memo view functionality - now properly displays title, link, and content
- June 29, 2025. Added 15 diverse fake memo entries spanning June 15-29, 2025 for demo purposes
- June 29, 2025. Reduced memo list spacing from 32px to 12px for tighter layout
- June 29, 2025. Changed font weight from 300 (font-light) to 400 (font-normal) for better readability
- June 29, 2025. Fixed React Query URL construction for individual memo API calls
- June 30, 2025. Implemented OpenAI-inspired minimal design system with Inter font and black/white/gray palette
- June 30, 2025. Updated authentication flow: users can now start writing without signing in
- June 30, 2025. Google auth triggers only on save, with automatic account creation and memo conflict handling
- June 30, 2025. Removed edit button from memo view and "Link attached" indicators for cleaner interface
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Git configuration: Always use williammillerworks <william.miller.works@gmail.com> for commits.

For correct git attribution in Replit environment:
1. Set global git config:
   git config --global user.name "williammillerworks"
   git config --global user.email "william.miller.works@gmail.com"

2. To fix existing commits with wrong attribution, use:
   export GIT_AUTHOR_NAME="williammillerworks"
   export GIT_AUTHOR_EMAIL="william.miller.works@gmail.com"
   export GIT_COMMITTER_NAME="williammillerworks"
   export GIT_COMMITTER_EMAIL="william.miller.works@gmail.com"
   git filter-branch -f --env-filter '
   if [ "$GIT_AUTHOR_NAME" = "williammillerwo" ]; then
       export GIT_AUTHOR_NAME="williammillerworks"
       export GIT_AUTHOR_EMAIL="william.miller.works@gmail.com"
   fi
   if [ "$GIT_COMMITTER_NAME" = "williammillerwo" ]; then
       export GIT_COMMITTER_NAME="williammillerworks"
       export GIT_COMMITTER_EMAIL="william.miller.works@gmail.com"
   fi
   ' -- --all
   git push --force origin main
```