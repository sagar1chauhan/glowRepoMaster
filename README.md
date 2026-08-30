# GlowRep Master Panel

A full-stack web application featuring a modern React frontend (Vite) and a scalable NestJS backend. This project serves as a master panel for managing rep data, sales, and attendance with integrations like Razorpay, BullMQ (Redis), and PostgreSQL.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **PWA:** Vite PWA Plugin
- **Authentication/DB:** Supabase JS Client

### Backend
- **Framework:** NestJS 11
- **Database:** PostgreSQL (pg)
- **Message Queue/Job Scheduling:** BullMQ & Redis (ioredis)
- **Authentication:** JWT, Passport
- **Payment Gateway:** Razorpay
- **Validation & Hashing:** bcrypt, uuid

### Infrastructure
- **Containerization:** Docker & Docker Compose (for PostgreSQL)

---

## ✨ Core Features & Roadmap

### 1. Members Management
- Comprehensive CRUD operations for gym members.
- Members list with searchable and paginated views.
- Detailed profiles with attendance history and status tracking.

### 2. Payments & Billing
- **Razorpay Integration:** Generate payment links (UPI/Cards) for membership renewals directly from the dashboard.
- **Manual Cash Logging:** Simple interface to log physical cash payments and update daily totals instantly.
- **Webhooks:** Automated status updates on successful Razorpay payments.

---

## 📁 Project Structure

```text
.
├── backend/            # NestJS application (APIs, Jobs, DB connectivity)
├── frontend/           # React + Vite application (UI, State, Routing)
├── database/           # Database scripts (schema.sql)
└── docker-compose.yml  # Docker compose configuration for Postgres database
```

---

## 🛠️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**
- **Docker** and **Docker Compose** (for running the PostgreSQL database locally)

---

## ⚙️ Local Development Setup

### 1. Database Setup (Docker)
Start the PostgreSQL database using Docker Compose from the root directory:
```bash
docker-compose up -d
```
This will start a PostgreSQL instance on port `5433` with the default user/password defined in the `docker-compose.yml`. You can initialize the database using the `database/schema.sql` script.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `backend/` directory based on required variables (Database URL, Razorpay Keys, JWT Secret, Redis URL).
4. Start the backend development server:
   ```bash
   npm run start:dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `frontend/` directory and configure the API endpoint and Supabase keys.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 📜 Available Scripts

### Backend (`/backend`)
- `npm run start:dev` - Starts the app in development mode with hot-reloading.
- `npm run build` - Builds the application for production.
- `npm run start:prod` - Runs the compiled production application.
- `npm run test` - Runs unit tests.

### Frontend (`/frontend`)
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the TypeScript code and creates a production bundle.
- `npm run preview` - Previews the production build locally.
- `npm run lint` - Runs oxlint for code analysis.

---

## 🔒 License
This project is proprietary and confidential.
