# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ConvertStudio - A modern file conversion platform built with React, TypeScript, and Firebase. The project supports multiple format conversions with AI-powered enhancements through cloud processing.

## Commands

### Development
```bash
npm run dev        # Start Vite development server (port 5173)
npm run build      # TypeScript check + Vite production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

### Firebase Development & Deployment
```bash
# Local Development
firebase emulators:start                          # Start all Firebase emulators
firebase emulators:start --only functions,firestore  # Specific emulators

# Functions Development
cd functions && npm run build     # Build Functions TypeScript
cd functions && npm run serve     # Serve Functions locally
cd functions && npm run shell     # Functions interactive shell

# Firebase Deployment
firebase deploy --only functions  # Deploy Cloud Functions
firebase deploy --only firestore:rules  # Deploy Firestore rules
firebase deploy --only storage:rules     # Deploy Storage rules
```

### Frontend Deployment (Vercel)
```bash
# Vercel CLI (if installed)
vercel                        # Deploy to Vercel
vercel --prod                 # Deploy to production

# Or connect GitHub repo to Vercel for automatic deployments
```

## Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Vite** as build tool with SWC for fast refresh
- **Tailwind CSS** (v4) configured via Vite plugin
- **Firebase SDK** for authentication, storage, and database

### Project Structure
```
src/
├── config/           # Firebase configuration (firebase.config.ts)
├── features/         # Feature-based architecture
│   └── dashboard/    # Dashboard feature module
│       ├── components/   # ConversionCard, DragDropSection
│       └── pages/        # Dashboard page component
├── shared/           # Shared/reusable components
│   └── components/   # Button, Header, HeroSection
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

### Architecture Overview

- **Frontend**: React SPA hosted on Vercel
- **Backend**: Firebase Functions (serverless)
- **Database**: Firestore for user data and file metadata
- **Storage**: Firebase Storage for file uploads/downloads
- **Authentication**: Firebase Auth (Email/Password + Google OAuth)
- **File Processing**: Cloud Functions for conversion logic

### Key Implementation Patterns

1. **Feature-Based Architecture**: Components organized by feature domain in `src/features/`, with shared components in `src/shared/`
2. **Component Design**: Follows consistent patterns with TypeScript interfaces, proper prop typing, and Tailwind CSS styling
3. **Environment Variables**: Firebase config uses Vite's `import.meta.env` pattern for environment-specific configuration
4. **Styling System**: 
   - Tailwind CSS v4 with Vite plugin integration
   - Consistent color palette (blue-600 for primary actions, gray scale for neutrals)
   - Responsive design patterns with mobile-first approach
5. **TypeScript Configuration**: Split between app (`tsconfig.app.json`) and node (`tsconfig.node.json`) contexts

### Component Architecture

- **Shared Components**: Reusable UI components (Button, Header, HeroSection) with consistent APIs
- **Feature Components**: Domain-specific components organized by feature (dashboard)
- **Button Component**: Standardized with variants (primary/secondary/outline) and sizes (small/medium/large)
- **Drag & Drop**: File upload functionality with visual feedback and file listing

## Development Workflow

The project follows a part-time agile development approach with 2-week sprints. Current phase focuses on foundation and core features including:
- Basic file upload/download to Firebase Storage
- PDF to DOCX conversion via Cloud Functions
- User authentication with Firebase Auth
- File history tracking in Firestore

## Development Guidelines

### Code Style & Conventions
- Use TypeScript interfaces for all component props
- Follow the established component structure with proper imports and exports
- Maintain consistent naming: PascalCase for components, camelCase for functions/variables
- Use Tailwind classes directly in components (no CSS modules)
- Implement responsive design with mobile-first approach using Tailwind breakpoints

### Firebase Integration
- Firebase configuration is centralized in `src/config/firebase.config.ts`
- Environment variables follow `VITE_FIREBASE_*` naming convention
- Import Firebase services as needed in components (not globally initialized)

## Firebase Configuration

### Emulator Ports
- **Auth**: 9099
- **Functions**: 5001  
- **Firestore**: 8080
- **Storage**: 9199
- **UI**: Enabled with single project mode

### Services Initialized
- ✅ **Firestore**: Database with rules and indexes
- ✅ **Functions**: Node.js 22 with TypeScript
- ✅ **Storage**: File storage with security rules
- ✅ **Emulators**: Full local development suite

### Deployment Architecture
- **Frontend**: Vercel (automatic GitHub deployments)
- **Backend**: Firebase Functions
- **Database**: Firestore (nam5 region)
- **Storage**: Firebase Storage

## Important Notes

- No test framework is currently configured - tests should be added when needed
- Project uses modern React 19 with concurrent features
- The official app name is "ConvertStudio" - ensure consistency across all UI elements
- The project is in early development (Phase 1) targeting an October 2025 MVP launch
- Frontend hosted on Vercel, backend services on Firebase