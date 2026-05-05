@echo off
echo Starting Backend API (port 5001)...
start "API Backend" cmd /k "cd /hdv/ptpmhuongdichvu/API && dotnet run"

echo Starting Gateway (port 5000)...
start "API Gateway" cmd /k "cd /hdv/ptpmhuongdichvu/MyWebAPI && dotnet run"

echo Starting Frontend (port 5173)...
start "Frontend" cmd /k "cd /hdv/ptpmhuongdichvu/frontend && npm run dev"

echo.
echo All services started!
echo Frontend: http://localhost:5173
echo API: http://localhost:5001/swagger
echo Gateway: http://localhost:5000/swagger
echo.
pause
