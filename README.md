# ConvertStudio

A modern, professional file conversion platform built with React, TypeScript, and Firebase. Convert documents, images, and other files with AI-powered enhancements and seamless cloud processing.

## 🚀 Features

- **Multiple Format Support**: Convert between PDF, DOCX, images, and more
- **AI Enhancement**: OCR and intelligent document processing
- **Cloud Processing**: Secure Firebase-powered backend
- **User Authentication**: Google and email login support
- **File Management**: Track conversion history and manage files
- **Batch Processing**: Convert multiple files at once
- **Real-time Updates**: Live conversion status and progress

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** as build tool with SWC for fast refresh
- **Tailwind CSS v4** configured via Vite plugin
- **React Router DOM v7** for routing
- **Hosted on Vercel** with automatic deployments

### Backend
- **Firebase Authentication** (Email/Password + Google OAuth)
- **Cloud Firestore** for user data and file metadata
- **Firebase Storage** for file uploads and downloads
- **Cloud Functions** (Node.js 22) for file processing
- **Firebase Emulators** for local development

### Additional Tools
- **ESLint 9** with TypeScript support
- **Feature-based architecture** for scalability

## 🚧 Development Status

Currently in **Phase 1 development** (August 2025). See [planning/ai-converter-plan.md](planning/ai-converter-plan.md) for detailed roadmap.

### Current Sprint: Foundation & Core Features ✅

**Phase 1 Complete (August 6, 2025)**:
- [x] Project setup with modern tooling (React 19, TypeScript, Vite)
- [x] Firebase initialization (Functions, Firestore, Storage, Auth)
- [x] Development environment with Firebase emulators
- [x] Feature-based architecture implementation
- [x] Authentication system UI components
- [x] Advanced drag-and-drop file interface with progress tracking
- [x] Firebase Storage integration with organized directory structure
- [x] PDF to DOCX conversion with real text extraction (pdf-parse)
- [x] User authentication flows (Email/Password + Google OAuth)
- [x] Real-time conversion status tracking
- [x] Type-safe environment configuration
- [x] Scalable storage architecture for millions of files

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase CLI: `npm install -g firebase-tools`

### Installation

```bash
# Clone the repository
git clone https://github.com/blake-nelson-dev/file-converter.git
cd file-converter

# Install frontend dependencies
npm install

# Install Firebase Functions dependencies
cd functions && npm install && cd ..

# Login to Firebase (if not already logged in)
firebase login
```

### Local Development

```bash
# 1. Start Firebase emulators (in one terminal)
firebase emulators:start

# 2. Start Vite development server (in another terminal)
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Firebase Emulator UI**: http://localhost:4000

### Environment Setup

Create environment variables for Firebase configuration:

```bash
# .env.local (create this file)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🔧 Firebase Configuration

### Services Initialized
- ✅ **Firestore**: Database with security rules (`firestore.rules`)
- ✅ **Cloud Functions**: TypeScript functions in `/functions` directory
- ✅ **Storage**: File storage with security rules (`storage.rules`)
- ✅ **Authentication**: Email/password and Google OAuth
- ✅ **Emulators**: Complete local development environment

### Emulator Ports
- **Auth**: http://localhost:9099
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **Storage**: http://localhost:9199
- **Emulator UI**: http://localhost:4000

### Functions Development

```bash
cd functions

# Build TypeScript
npm run build

# Serve functions locally
npm run serve

# Interactive shell
npm run shell

# Deploy functions only
firebase deploy --only functions
```

## 📁 Project Structure

```
file-converter/
├── src/                          # Frontend React application
│   ├── config/                   # Firebase configuration
│   ├── contexts/                 # React contexts (Auth)
│   ├── components/               # Route protection components
│   ├── features/                 # Feature-based modules
│   │   ├── auth/                 # Authentication features
│   │   ├── dashboard/            # Main dashboard
│   │   └── about/                # About page
│   ├── shared/                   # Shared components
│   │   └── components/
│   │       ├── ui/               # Button, etc.
│   │       ├── layout/           # Header, etc.
│   │       ├── forms/            # Form components
│   │       └── feedback/         # Loading, Error states
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
│
├── functions/                    # Firebase Functions (backend)
│   ├── src/
│   │   └── index.ts              # Functions entry point
│   ├── package.json
│   └── tsconfig.json
│
├── planning/                     # Project documentation
└── [config files]               # Root configuration
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main
3. Add environment variables in Vercel dashboard

### Backend (Firebase)
```bash
# Deploy all Firebase services
firebase deploy

# Deploy specific services
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## 📅 Development Roadmap

- **Phase 1** (August 2025): Foundation & Core Features
  - ✅ Project setup and Firebase integration
  - 🚧 File upload/download and PDF to DOCX conversion
  - 📋 User authentication and basic UI

- **Phase 2** (September-October 2025): MVP Launch
  - Additional conversion formats
  - User dashboard and file history
  - Payment integration (Stripe)

- **Phase 3** (November-December 2025): AI Features
  - OCR and document enhancement
  - Batch processing improvements
  - Performance optimization

- **Phase 4** (January 2026+): Enterprise Features
  - API access and webhooks
  - Team collaboration features
  - Advanced analytics

## 🧪 Available Scripts

```bash
# Frontend
npm run dev        # Start Vite development server
npm run build      # TypeScript check + production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint

# Firebase
firebase emulators:start                          # Start all emulators
firebase emulators:start --only functions,firestore  # Specific emulators
firebase deploy --only functions                 # Deploy functions
firebase deploy --only firestore:rules           # Deploy database rules

# Functions (from /functions directory)
npm run build      # Build TypeScript
npm run serve      # Serve functions locally
npm run shell      # Interactive functions shell
```

## 🤝 Contributing

This is currently a solo development project following agile part-time development practices. The project uses:

- **Feature-based architecture** for organized development
- **2-week sprints** with clear goals and deliverables
- **TypeScript** for type safety and better developer experience
- **Modern React patterns** with hooks and context

## 📄 License

See [LICENSE](LICENSE) file for details.

---

**ConvertStudio** - Transform your files with confidence 🚀