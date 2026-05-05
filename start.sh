#!/bin/bash

echo "🚀 Starting Backend API (port 5001)..."
cd API && dotnet run &
API_PID=$!

echo "🚀 Starting Gateway (port 5000)..."
cd ../MyWebAPI && dotnet run &
GATEWAY_PID=$!

echo "🚀 Starting Frontend (port 5173)..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo "📍 Frontend: http://localhost:5173"
echo "📍 API: http://localhost:5001/swagger"
echo "📍 Gateway: http://localhost:5000/swagger"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for Ctrl+C
trap "kill $API_PID $GATEWAY_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
