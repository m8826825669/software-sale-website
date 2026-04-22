#!/bin/bash
# ================================================================
# SoftCraft Website — Development Quick Start (Linux / macOS)
# ================================================================
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SoftCraft Solutions — Dev Server  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# --- Backend setup ---
echo -e "${YELLOW}▶ Setting up Django backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo "  Created virtual environment"
fi

source venv/bin/activate
pip install -r requirements.txt -q

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "  ${YELLOW}⚠ Created .env from example. Edit it with your Razorpay keys!${NC}"
fi

python manage.py migrate --run-syncdb
python manage.py seed_products
echo -e "  ${GREEN}✔ Backend ready${NC}"

# Start Django in background
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!
echo -e "  ${GREEN}✔ Django running on http://localhost:8000${NC}"

cd ..

# --- Frontend setup ---
echo ""
echo -e "${YELLOW}▶ Setting up Next.js frontend...${NC}"
cd frontend

if [ ! -f ".env.local" ]; then
  cp .env.local.example .env.local
  echo "  Created .env.local"
fi

if [ ! -d "node_modules" ]; then
  npm install
fi

echo -e "  ${GREEN}✔ Frontend ready${NC}"
echo -e "  ${GREEN}✔ Starting Next.js on http://localhost:3000${NC}"
echo ""
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Frontend:  http://localhost:3000        ${NC}"
echo -e "${GREEN}  API:       http://localhost:8000/api/   ${NC}"
echo -e "${GREEN}  Admin:     http://localhost:8000/admin/ ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""

npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null; echo 'Stopped.'" EXIT
