@echo off
REM ================================================================
REM  SoftCraft Website — Windows Development Quick Start
REM ================================================================
title SoftCraft Solutions — Dev Server

echo.
echo  ==========================================
echo    SoftCraft Solutions - Dev Setup
echo  ==========================================
echo.

REM ── Step 1: Upgrade pip (fixes many build issues) ────────────────────────
echo [1/6] Upgrading pip...
python.exe -m pip install --upgrade pip --quiet
echo   Done.

REM ── Step 2: Backend setup ────────────────────────────────────────────────
echo.
echo [2/6] Setting up Django backend...
cd backend

if not exist venv (
    echo   Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate

echo   Installing dependencies (dev only, no Redis/Postgres needed)...
pip install -r requirements-dev.txt --quiet
if %errorlevel% neq 0 (
    echo.
    echo   ERROR: pip install failed. Try running manually:
    echo     cd backend
    echo     venv\Scripts\activate
    echo     pip install -r requirements-dev.txt
    pause
    exit /b 1
)

REM ── Step 3: Environment file ─────────────────────────────────────────────
if not exist .env (
    copy .env.example .env > nul
    echo   Created .env from example.
    echo.
    echo   *** IMPORTANT: Edit backend\.env and add your Razorpay test keys! ***
    echo   *** RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX                          ***
    echo   *** RAZORPAY_KEY_SECRET=XXXXXXXXXX                               ***
    echo.
)

REM ── Step 4: Database migrations ──────────────────────────────────────────
echo [3/6] Running database migrations...
python manage.py migrate --run-syncdb 2>&1 | findstr /V "^$"
python manage.py seed_products
echo   Database ready.

REM ── Step 5: Create superuser (first time only) ───────────────────────────
echo.
echo [4/6] Checking for admin user...
python manage.py shell -c "from apps.accounts.models import User; print('Admin exists' if User.objects.filter(is_staff=True).exists() else 'NO_ADMIN')" 2>nul | findstr "NO_ADMIN" > nul
if %errorlevel% equ 0 (
    echo   No admin user found. Creating one now...
    echo   Please enter credentials for the admin panel:
    python manage.py createsuperuser
)

REM ── Step 6: Start Django in background ───────────────────────────────────
echo.
echo [5/6] Starting Django backend on http://localhost:8000 ...
start "Django Backend" cmd /k "cd /d %CD% && call venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

cd ..

REM ── Step 7: Frontend setup ───────────────────────────────────────────────
echo.
echo [6/6] Setting up Next.js frontend...
cd frontend

if not exist .env.local (
    copy .env.local.example .env.local > nul
    echo   Created .env.local
)

if not exist node_modules (
    echo   Installing npm packages (this takes 1-2 minutes first time)...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo   ERROR: npm install failed.
        pause
        exit /b 1
    )
)

echo.
echo  ==========================================
echo    READY!
echo  ==========================================
echo    Frontend:  http://localhost:3000
echo    API:       http://localhost:8000/api/
echo    Admin UI:  http://localhost:8000/admin/
echo    Validate:  http://localhost:3000/validate
echo  ==========================================
echo.
echo  Starting Next.js... (Ctrl+C to stop)
echo.

npm run dev
