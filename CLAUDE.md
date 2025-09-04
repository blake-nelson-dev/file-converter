# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ConvertStudio is a modern file conversion platform with a **monorepo architecture** using Turbo for orchestration. The project follows a **feature-based architecture** with separate packages for different concerns:

- `packages/web`: React 19 frontend with Vite, TypeScript, and Tailwind CSS v4
- `packages/functions`: Firebase Cloud Functions for file processing (Node.js 22)
- `packages/shared`: Shared TypeScript types and utilities
- `packages/config`: Firebase and deployment configuration

The application uses **Firebase** as the backend (Auth, Firestore, Storage, Functions) with local emulator support for development.

## Core Architecture

### Frontend (packages/web)
- **Feature-based structure**: Each feature has its own `pages/`, `components/`, and `utils/` directories
- **Context pattern**: `AuthProvider` for global auth state management
- **Route protection**: `ProtectedRoute` and `PublicRoute` components handle auth-based access
- **Error boundaries**: Global error handling with `ErrorBoundary` component
- **Main features**: Dashboard (file upload), Conversions (history), Auth (signin/signup/reset)

### Backend (packages/functions)
- **Cloud Functions**: Storage triggers for file conversion processing
- **Main function**: `processFileConversion` triggered by Storage uploads
- **File path structure**: `files/{userId}/conversions/{year}/{month}/{conversionType}/{uuid}-{timestamp}-{filename}`
- **Conversion flow**: Download → Convert → Upload → Update Firestore status
- **Error handling**: Status updates with progress tracking in Firestore

### Shared (packages/shared)
- **Types**: Conversion status types, user types, validation schemas
- **Cross-package utilities**: Shared between web and functions

## Development Commands

```bash
# Root level - uses Turbo for orchestration
npm run dev          # Start all packages in development mode
npm run build        # Build all packages
npm run typecheck    # Run TypeScript checks across all packages
npm run test         # Run tests (when implemented)
npm run setup        # Install dependencies and build all packages

# Firebase development (run in root)
firebase emulators:start  # Start all Firebase emulators
firebase deploy          # Deploy all services to production

# Package-specific commands
cd packages/web && npm run dev      # Web frontend only
cd packages/functions && npm run serve  # Functions with emulator
cd packages/functions && npm run shell  # Interactive functions shell
```

## Firebase Configuration

- **Emulator ports**: Auth (9099), Functions (5001), Firestore (8080), Storage (9199), UI (4000)
- **Environment**: Requires `.env.local` in web package with Firebase config
- **File processing**: Automatic conversion on Storage uploads in `files/` paths
- **Security**: Firestore and Storage rules in `packages/config/`

## Key Development Notes

- **Node.js 18+** required with npm 8+
- **Firebase CLI** must be installed globally
- **Turbo** handles workspace orchestration and caching
- **TypeScript strict mode** enabled across all packages
- **No linting configured** - removed from project
- **Deployment**: Web on Vercel, Functions on Firebase