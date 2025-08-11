# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ConvertStudio - A modern file conversion platform built with React, TypeScript, and Firebase. The project supports multiple format conversions with AI-powered enhancements through cloud processing.

## Commands

### Development (Turbo Monorepo)
```bash
npm run dev              # Start all workspaces in development (Turbo parallel)
npm run build            # Build all workspaces (Turbo with dependencies)
npm run typecheck        # Type check all workspaces
npm run test             # Run tests across all workspaces
npm run clean            # Clean all build artifacts
npm run setup            # Install dependencies and build all packages
npm run verify           # Verify monorepo structure
```

### Workspace-specific Commands
```bash
# Web Frontend (packages/web)
npm run dev --filter=web       # Start Vite dev server (port 5173)
npm run build --filter=web     # Build React application
npm run deploy --filter=web    # Deploy to Vercel

# Firebase Functions (packages/functions)  
npm run dev --filter=functions    # Start Functions emulator
npm run build --filter=functions  # Build Functions TypeScript
npm run deploy --filter=functions # Deploy Cloud Functions

# Firebase Configuration (packages/config)
cd packages/config && firebase emulators:start    # Start all Firebase emulators
cd packages/config && firebase deploy             # Deploy all Firebase services
```

### Firebase Development & Deployment
```bash
# Local Development
cd packages/config && firebase emulators:start                          # Start all Firebase emulators
cd packages/config && firebase emulators:start --only functions,firestore  # Specific emulators

# Firebase Deployment
cd packages/config && firebase deploy --only functions    # Deploy Cloud Functions
cd packages/config && firebase deploy --only firestore:rules  # Deploy Firestore rules
cd packages/config && firebase deploy --only storage:rules     # Deploy Storage rules
```

## Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Vite** as build tool with SWC for fast refresh
- **Tailwind CSS** (v4) configured via Vite plugin
- **Firebase SDK** for authentication, storage, and database

### Monorepo Structure
```
packages/
├── web/              # React Frontend Application
│   ├── src/
│   │   ├── config/           # Firebase configuration (firebase.config.ts)
│   │   ├── contexts/         # React contexts (AuthContext.tsx)
│   │   ├── features/         # Feature-based architecture
│   │   │   ├── auth/         # Authentication features
│   │   │   ├── conversion/   # File conversion UI components
│   │   │   └── dashboard/    # Dashboard feature module
│   │   │       ├── components/   # DragDropSection with full upload functionality
│   │   │       └── pages/        # Dashboard page component
│   │   ├── services/         # Business logic services
│   │   │   ├── storage.service.ts    # Firebase Storage operations
│   │   │   ├── firestore.service.ts  # Firestore database operations
│   │   │   └── index.ts             # Service exports
│   │   ├── shared/           # Shared/reusable components
│   │   │   └── components/   # Button, Header, HeroSection, GlobalLoading
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Application entry point
│   ├── package.json         # Web app dependencies
│   └── vite.config.ts       # Vite configuration
├── functions/        # Firebase Cloud Functions
│   ├── src/
│   │   ├── converters/      # File conversion logic
│   │   │   └── pdfToDocx.converter.ts
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Functions entry point
│   └── package.json         # Functions dependencies
├── config/           # Firebase Configuration
│   ├── firebase.json        # Firebase project configuration
│   ├── firestore.rules      # Firestore security rules
│   ├── firestore.indexes.json  # Firestore indexes
│   └── storage.rules        # Storage security rules
├── shared/           # Shared TypeScript Types & Utilities
│   ├── src/
│   │   ├── types/           # Shared type definitions
│   │   └── utils/           # Shared utility functions
│   └── package.json         # Shared package dependencies
└── tools/            # Development Tools & Scripts
    └── scripts/             # Build and utility scripts

docs/                 # Project Documentation
├── sprint-1-august-2025.md  # Current sprint planning
└── privacy-policy.md        # Privacy policy document
```

### Architecture Overview

- **Monorepo**: Turbo-powered workspace with shared dependencies
- **Frontend**: React SPA (packages/web) hosted on Vercel
- **Backend**: Firebase Functions (packages/functions) - serverless
- **Database**: Firestore for user data and file metadata
- **Storage**: Firebase Storage for file uploads/downloads
- **Authentication**: Firebase Auth (Email/Password + Google OAuth)
- **File Processing**: Cloud Functions for conversion logic
- **Shared Code**: Common types and utilities (packages/shared)
- **Configuration**: Centralized Firebase config (packages/config)

### Key Implementation Patterns

1. **Monorepo Architecture**: Turbo-powered workspace organization with:
   - Shared TypeScript types and utilities across packages
   - Optimized build caching and parallel execution
   - Clear separation of concerns (web, functions, config, shared)
2. **Feature-Based Architecture**: Components organized by feature domain in `packages/web/src/features/`, with shared components in `packages/web/src/shared/`
3. **Service Layer Architecture**: Separation of concerns with dedicated services for Firebase operations
4. **Component Design**: Follows consistent patterns with TypeScript interfaces, proper prop typing, and Tailwind CSS styling
5. **Environment Variables**: Firebase config uses Vite's `import.meta.env` pattern for environment-specific configuration
6. **Privacy-First Design**: Dual storage modes with anonymous processing options
7. **Security-Focused**: UUID-based paths, on-demand URL generation, proper access controls
8. **Styling System**: 
   - Tailwind CSS v4 with Vite plugin integration
   - Consistent color palette (blue-600 for primary actions, gray scale for neutrals)
   - Responsive design patterns with mobile-first approach
9. **TypeScript Configuration**: Optimized for monorepo with shared build configurations

### Component Architecture

- **Shared Components**: Reusable UI components (Button, Header, HeroSection, GlobalLoading) with consistent APIs
- **Feature Components**: Domain-specific components organized by feature (dashboard)
- **Button Component**: Standardized with variants (primary/secondary/outline) and sizes (small/medium/large)
- **Advanced Drag & Drop**: Full file upload system with:
  - Dual storage modes (permanent vs anonymous)
  - Real-time progress tracking
  - Error handling and recovery
  - Completed files management
  - File re-selection support

### Service Architecture

- **StorageService**: Handles Firebase Storage operations, UUID generation, and file uploads
- **FirestoreService**: Manages file metadata, user files, and on-demand URL generation
- **AuthContext**: Centralized authentication state and user management
- **Clean Separation**: Business logic separated from UI components

## Development Workflow

The project follows a part-time agile development approach with 2-week sprints. 

### Current Implementation Status (Sprint 1 - August 11, 2025)
- ✅ **Monorepo Architecture**: Turbo-powered workspace with optimized builds
- ✅ **File Upload System**: Complete with organized directory structure
- ✅ **Authentication**: Firebase Auth with Email/Password + Google OAuth
- ✅ **Security Architecture**: UUID-based paths, on-demand URL generation
- ✅ **Privacy Framework**: Anonymous processing, privacy policy, GDPR/CCPA compliance
- ✅ **UI/UX**: Advanced drag-drop, progress tracking, error handling
- ✅ **File Conversion**: PDF to DOCX conversion with pdf-parse integration
- ✅ **Cloud Functions**: Complete conversion processing pipeline
- ✅ **Environment Configuration**: Type-safe environment validation
- ✅ **Storage Organization**: Scalable directory structure implemented
- ✅ **Shared Types**: Common TypeScript definitions across packages
- ✅ **Build System**: Optimized Turbo configuration with caching

## Development Guidelines

### Code Style & Conventions
- Use TypeScript interfaces for all component props
- Follow the established component structure with proper imports and exports
- Maintain consistent naming: PascalCase for components, camelCase for functions/variables
- Use Tailwind classes directly in components (no CSS modules)
- Implement responsive design with mobile-first approach using Tailwind breakpoints

### Firebase Integration
- Firebase configuration is centralized in `packages/web/src/config/firebase.config.ts`
- Firebase project configuration in `packages/config/firebase.json`
- Environment variables follow `VITE_FIREBASE_*` naming convention
- Import Firebase services as needed in components (not globally initialized)
- Security rules and indexes managed in `packages/config/`

## Storage Architecture

### Organized Directory Structure (Updated Aug 6, 2025)

The storage system uses a hierarchical directory structure optimized for scalability and organization:

#### **Permanent Storage** (`saveToAccount: true`)
```
Path: files/{userId}/conversions/{year}/{month}/{conversionType}/{uuid}-{timestamp}-{fileName}
Example: files/abc123/conversions/2025/08/pdf-to-docx/550e8400-{timestamp}-document.pdf

Features:
- Full filename preservation with timestamp
- Organized by date and conversion type
- Firestore metadata tracking
- Soft delete functionality
- User file history
- On-demand URL generation
- Scalable to millions of files
```

#### **Anonymous Storage** (`saveToAccount: false`)
```
Path: temp/conversions/{year-month-day}/{conversionType}/{uuid}/original.{ext}
Example: temp/conversions/2025-08-06/pdf-to-docx/550e8400-{uuid}/original.pdf

Features:
- No user ID in path (anonymous)
- Generic filename (privacy protection)
- Organized by date for efficient cleanup
- No Firestore tracking
- Auto-deletion after 1 hour
- No user association
```

#### **Conversion Types Supported:**
- `pdf-to-docx` - PDF to Word conversion
- `docx-to-pdf` - Word to PDF conversion
- `image-conversion` - Image format conversions
- `unknown-format` - Unsupported file types

#### **Benefits of New Structure:**
- **Scalable**: Firebase-friendly (under 1000 items per folder)
- **Organized**: Easy file management and cleanup
- **Conversion-aware**: Separate workflows by type
- **Time-based**: Analytics and bulk operations support
- **Future-ready**: Easy to add new conversion types

### Security Features
- **UUID-based paths**: Cryptographically secure (2^122 combinations)
- **On-demand URLs**: Download URLs generated when needed, not stored
- **Access control**: Firestore permissions checked before URL generation
- **Anonymous processing**: Zero user tracking for privacy-conscious users

## Firebase Configuration

### Emulator Ports
- **Auth**: 9099
- **Functions**: 5001  
- **Firestore**: 8080
- **Storage**: 9199
- **UI**: http://localhost:4000

### Services Initialized
- ✅ **Firestore**: Database with rules and indexes
- ✅ **Functions**: Node.js 22 with TypeScript
- ✅ **Storage**: File storage with advanced security rules
- ✅ **Emulators**: Full local development suite with emulator connections

### Deployment Architecture
- **Frontend**: Vercel (automatic GitHub deployments)
- **Backend**: Firebase Functions
- **Database**: Firestore (nam5 region)
- **Storage**: Firebase Storage with dual-mode architecture

## Important Notes

- No test framework is currently configured - tests should be added when needed
- Project uses modern React 19 with concurrent features
- The official app name is "ConvertStudio" - ensure consistency across all UI elements
- The project is in early development (Phase 1) targeting an October 2025 MVP launch
- Frontend hosted on Vercel, backend services on Firebase