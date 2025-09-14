#!/bin/bash

echo "Starting CityInfo Full Stack Application..."
echo

cd "$(dirname "$0")"

echo "========================================"
echo "Starting Backend Server..."
echo "========================================"
gnome-terminal --title="Backend Server" -- bash -c "./start-backend.sh; exec bash" 2>/dev/null || \
xterm -title "Backend Server" -e "./start-backend.sh; bash" 2>/dev/null || \
open -a Terminal "./start-backend.sh" 2>/dev/null || \
{
    echo "Starting backend in background..."
    ./start-backend.sh &
}

echo
echo "Waiting 5 seconds for backend to initialize..."
sleep 5

echo "========================================"
echo "Starting Frontend Development Server..."
echo "========================================"
gnome-terminal --title="Frontend Server" -- bash -c "./start-frontend.sh; exec bash" 2>/dev/null || \
xterm -title "Frontend Server" -e "./start-frontend.sh; bash" 2>/dev/null || \
open -a Terminal "./start-frontend.sh" 2>/dev/null || \
{
    echo "Starting frontend in background..."
    ./start-frontend.sh &
}

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all servers"
wait