# Environment Setup Guide

**Last Updated**: August 11, 2025  
**Status**: Current - Monorepo Configuration

## Environment Variables

The monorepo requires environment variables for Firebase configuration and feature flags.

### Required Files

1. **Root `.env`** - Contains all environment variables (for reference)
2. **`packages/web/.env`** - Copy of root `.env` for Vite to access
3. **`.env.example`** - Template for other developers

### Setup Instructions

1. **Copy environment files to web package:**
   ```bash
   cp .env packages/web/.env
   cp .env.example packages/web/.env.example
   ```

2. **Verify web package can access variables:**
   ```bash
   cd packages/web && npm run dev
   ```

### Required Environment Variables

#### Firebase Configuration
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Development Settings
```env
VITE_USE_FIREBASE_EMULATORS=true
VITE_ENVIRONMENT=development
```

#### Feature Flags
```env
VITE_ENABLE_ANONYMOUS_UPLOADS=true
VITE_MAX_FILE_SIZE_MB=10
VITE_ENABLE_BATCH_UPLOADS=true
```

### Validation

The web package automatically validates all required environment variables on startup. If any are missing, you'll see an error like:

```
Missing required environment variable: VITE_FIREBASE_API_KEY. 
Please check your .env file and ensure it contains VITE_FIREBASE_API_KEY.
```

### Monorepo Considerations

- **Vite** (web package) looks for `.env` files in its own directory
- **Functions** don't need Vite environment variables
- **Root `.env`** serves as the master configuration
- **GitIgnore** protects all `.env` files from being committed

## Troubleshooting

**Issue**: "Missing required environment variable"
**Solution**: Ensure `.env` file exists in `packages/web/`

**Issue**: Environment variables not loading
**Solution**: Restart development server after changing `.env`

**Issue**: Different values between packages  
**Solution**: Keep root `.env` as master, sync to packages as needed