#!/bin/bash

echo "Starting ConvertStudio Development Environment..."
echo

# Build functions first
echo "[1/3] Building Firebase Functions..."
cd packages/functions
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Failed to build functions"
    exit 1
fi
cd ../..

# Start Firebase emulators in background
echo "[2/3] Starting Firebase Emulators..."
cd packages/config
firebase emulators:start --only functions,firestore,storage,auth &
EMULATOR_PID=$!
cd ../..

# Wait a moment for emulators to start
sleep 5

# Start frontend development server
echo "[3/3] Starting Frontend Development Server..."
echo
echo "================================================================"
echo "  ConvertStudio Development Environment Ready!"
echo "  "
echo "  Frontend:  http://localhost:5173"
echo "  Emulator UI: http://localhost:4000"
echo "  "
echo "  Press Ctrl+C to stop both services"
echo "================================================================"
echo

# Function to cleanup on script exit
cleanup() {
    echo
    echo "Shutting down development environment..."
    kill $EMULATOR_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

# Start frontend
npm run dev

# If we get here, cleanup
cleanup