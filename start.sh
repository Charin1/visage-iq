#!/bin/bash

# Visage IQ — Application Startup Script
# Launches Python FastAPI Backend (Port 8000) & React Vite Frontend (Port 5173)

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🚀 Starting Visage IQ Application..."
echo "📂 Project Root: $PROJECT_ROOT"

# Create designated log directories
mkdir -p "$PROJECT_ROOT/backend/logs"
mkdir -p "$PROJECT_ROOT/frontend/logs"

BACKEND_LOG="$PROJECT_ROOT/backend/logs/visage_iq_backend.log"
FRONTEND_LOG="$PROJECT_ROOT/frontend/logs/visage_iq_frontend.log"

echo "📝 Log Files:"
echo "   - Backend Log:  $BACKEND_LOG"
echo "   - Frontend Log: $FRONTEND_LOG"

# Automatically clear ports 8000 and 5173 to prevent [Errno 48] Address already in use
echo "🧹 Clearing existing processes on ports 8000 & 5173..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Cleanup function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down Visage IQ services..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    echo "✅ All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# --- 1. Start Python Backend ---
echo ""
echo "📦 Setting up Python Backend..."
cd "$PROJECT_ROOT/backend" || exit 1

if [ ! -d "venv" ]; then
    echo "⚙️ Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "🔄 Checking backend dependencies..."
pip install -q -r requirements.txt

echo "🟢 Launching FastAPI Backend on http://localhost:8000..."
python3 main.py 2>&1 | tee -a "$BACKEND_LOG" &
BACKEND_PID=$!

# --- 2. Start React Frontend ---
echo ""
echo "🎨 Setting up React Frontend..."
cd "$PROJECT_ROOT/frontend" || exit 1

if [ ! -f "node_modules/.bin/vite" ]; then
    echo "⚙️ Installing frontend node modules..."
    npm install
    if [ ! -f "node_modules/.bin/vite" ]; then
        echo "❌ Frontend installation failed. Please check network connectivity and run 'cd frontend && npm install' manually."
        exit 1
    fi
fi

echo "🟢 Launching Vite Frontend on http://localhost:5173..."
npm run dev > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo "  Visage IQ is now running!"
echo "  Backend API:  http://localhost:8000"
echo "  Frontend UI:  http://localhost:5173"
echo "  Backend Logs: $BACKEND_LOG"
echo "  Frontend Logs: $FRONTEND_LOG"
echo "=========================================================="
echo "Press Ctrl+C to stop all services."

# Keep script running to maintain background jobs
wait
