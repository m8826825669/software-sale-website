# 🚀 SoftCraft Solutions — Software Sales Website

A full-stack, production-ready software distribution and sales website built with **Next.js 14** (frontend) and **Django REST Framework** (backend). Includes Razorpay payment integration, license key management, and secure download delivery.

---

## 🎯 Features

### Customer-Facing
- 🌟 **Beautiful landing page** — animated hero, features, testimonials, FAQ, CTA
- 🛒 **Product pages** — full details, screenshots, pricing plans, reviews
- 💳 **Checkout** — Razorpay integration (UPI, cards, net banking, EMI)
- 📊 **User dashboard** — licenses, orders, download history
- 🔑 **License key management** — copy, activate, download per license
- 📥 **Secure downloads** — time-limited tokens (2h), max download limits
- 📄 **GST invoices** — auto-generated, downloadable from dashboard

### Admin
- 👤 **User management** — all registered users with purchase history
- 📦 **Product management** — CRUD for products, plans, categories
- 💰 **Order tracking** — all orders with Razorpay payment IDs
- 🔑 **License oversight** — all issued keys, activation counts

### Security
- JWT auth with refresh token rotation and blacklisting
- Razorpay HMAC-SHA256 payment signature verification
- Time-limited signed download tokens
- Rate limiting on auth endpoints
- CORS, CSP, HSTS, XSS headers configured
- IP restriction on Django admin via Nginx

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Django 4.2, Django REST Framework |
| Auth | JWT (SimpleJWT) with refresh + blacklisting |
| Database | PostgreSQL (prod) / SQLite (dev) |
| Payments | Razorpay (UPI, Cards, Net Banking) |
| Cache | Redis |
| Fonts | Syne (display) + DM Sans (body) |
| Deployment | Docker Compose + Nginx |

---

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm 9+

### 1-Command Start

**Linux / macOS:**
```bash
chmod +x run-dev.sh && ./run-dev.sh
```

**Windows:**
```bat
run-dev.bat
```

This automatically:
1. Creates Python virtual environment
2. Installs backend dependencies
3. Runs Django migrations
4. Seeds sample products
5. Starts Django on `http://localhost:8000`
6. Installs frontend dependencies
7. Starts Next.js on `http://localhost:3000`

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Edit with your keys
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_products  # Seeds sample products
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

---

## ⚙️ Configuration

### Backend `.env`
```env
SECRET_KEY=your-very-long-random-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXX
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
```

### Getting Razorpay Keys
1. Sign up at [razorpay.com](https://razorpay.com)
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy Key ID and Key Secret to both `.env` files
4. For production, use Live Keys after KYC verification

---

## 🐳 Production Deployment (Docker)

```bash
# 1. Copy and edit production env
cp .env.example .env.prod
nano .env.prod   # Fill in all values

# 2. Add SSL certificates
mkdir nginx/certs
# Place fullchain.pem and privkey.pem in nginx/certs/
# Use certbot: certbot certonly --standalone -d yourdomain.com

# 3. Update nginx.conf with your domain name

# 4. Launch everything
docker-compose --env-file .env.prod up -d

# 5. Create admin user
docker-compose exec backend python manage.py createsuperuser
```

**Access:**
- Website: `https://yourdomain.com`
- Admin panel: `https://yourdomain.com/admin/`
- API: `https://yourdomain.com/api/`

---

## 📁 Project Structure

```
softwaresales/
├── backend/                        # Django REST API
│   ├── config/                     # Settings, URLs, WSGI
│   ├── apps/
│   │   ├── accounts/               # Custom user, JWT auth
│   │   ├── products/               # Products, categories, pricing
│   │   │   └── management/commands/
│   │   │       └── seed_products.py  # Sample data seeder
│   │   ├── orders/                 # Razorpay orders + verification
│   │   ├── licenses/               # License key generation + validation
│   │   └── downloads/              # Secure download token system
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/                       # Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── products/           # Products listing + detail
│   │   │   ├── auth/               # Login, register, forgot password
│   │   │   ├── dashboard/          # User dashboard + profile
│   │   │   ├── checkout/           # Razorpay checkout
│   │   │   └── admin/              # Admin panel
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Sticky nav with auth dropdown
│   │   │   └── Footer.tsx          # Full footer with links
│   │   └── lib/
│   │       ├── api.ts              # Typed Axios client + auto-refresh
│   │       └── store.ts            # Zustand auth store
│   ├── Dockerfile
│   ├── package.json
│   └── .env.local.example
├── nginx/
│   └── nginx.conf                  # Production reverse proxy + SSL
├── docker-compose.yml
├── run-dev.sh                      # Linux/Mac dev starter
├── run-dev.bat                     # Windows dev starter
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login, get JWT tokens |
| POST | `/api/auth/logout/` | Blacklist refresh token |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/PATCH | `/api/auth/profile/` | Get/update profile |
| POST | `/api/auth/change-password/` | Change password |
| POST | `/api/auth/forgot-password/` | Send reset email |
| POST | `/api/auth/reset-password/` | Reset with token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List all products |
| GET | `/api/products/featured/` | Featured products |
| GET | `/api/products/{slug}/` | Product detail |
| GET | `/api/products/categories/` | All categories |
| GET | `/api/products/testimonials/` | Testimonials |

### Orders & Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/create/` | Create Razorpay order |
| POST | `/api/orders/verify/` | Verify payment signature |
| GET | `/api/orders/my-orders/` | User's order history |

### Licenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/licenses/my/` | User's licenses |
| POST | `/api/licenses/validate/` | Validate key (called by desktop app) |

### Downloads
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/downloads/request/` | Generate download token |
| GET | `/api/downloads/file/{token}/` | Stream file download |
| GET | `/api/downloads/history/` | Download history |

---

## 🔐 Security Checklist (Production)

- [ ] Change `SECRET_KEY` to a 50+ char random string
- [ ] Set `DEBUG=False`
- [ ] Configure real PostgreSQL (not SQLite)
- [ ] Add real Razorpay Live keys (after KYC)
- [ ] Set SSL certificates in `nginx/certs/`
- [ ] Restrict Django admin to your IP in nginx.conf
- [ ] Set `ALLOWED_HOSTS` to your domain
- [ ] Configure real email SMTP
- [ ] Enable Redis for production caching
- [ ] Set up regular database backups

---

## 📞 Support

Built by **SoftCraft Solutions**
- Email: support@softcraft.in
- WhatsApp: +91 98765 43210
- Location: Noida, Uttar Pradesh, India
