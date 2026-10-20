# JYC Connect — Complete University Youth Club Platform

> **Discover. Participate. Belong.**  
> Official digital platform for the **Jaypee Youth Club (JYC)**, Jaypee University, Anoopshahr.

---

## 🌟 Executive Summary

**JYC Connect** is a complete, production-oriented university youth club management system. It bridges university students, club coordinators, and university administration across **all ten official student hubs**:

1. **Cultural Hub** (`cultural`) — Traditions, festivals, music & dance.
2. **Visual Art Hub** (`visual-art`) — Sketching, painting, digital design & craft.
3. **AI & Coding Hub** (`ai-coding`) — Hackathons, competitive programming & AI sprints.
4. **Literary Hub** (`literary`) — Debates, creative writing, poetry & open-mics.
5. **Sports Hub** (`sports`) — Athletics, cricket, football & tournament fixtures.
6. **Business Hub** (`business`) — Entrepreneurship, venture pitches & financial literacy.
7. **Tinkering Hub** (`tinkering`) — Robotics, IoT hardware & rapid prototyping.
8. **Media Hub** (`media`) — Official event coverage, videography & digital storytelling.
9. **Social Work Hub** (`social-work`) — Community outreach, blood donation drives & social welfare.
10. **Alumni Hub** (`alumni`) — Graduate mentorship, industry connections & career guidance.

---

## 🏛️ Platform Architecture

```
┌──────────────────────────────────────────┐      HTTPS REST JSON       ┌──────────────────────────────────────────┐
│             React 18 SPA                 │ ◄────────────────────────► │           Express.js API                 │
│  • Vite 5 + React Router v6              │                            │  • ES Modules + Modular Monolith         │
│  • Handcrafted Design Tokens (CSS)       │                            │  • JWT Auth + Strict Role Guards         │
│  • Lucide React Icons                    │                            │  • Concurrency-Safe Event Engine         │
│  • Deploy Target: Vercel                 │                            │  • Deploy Target: Render                 │
└──────────────────────────────────────────┘                            └────────────────────┬─────────────────────┘
                                                                                             │ Prisma ORM
                                                                                             ▼
                                                                        ┌──────────────────────────────────────────┐
                                                                        │           Neon PostgreSQL DB             │
                                                                        │  • Normalized Relational Schema          │
                                                                        │  • Capacity Constraints & Foreign Keys   │
                                                                        └──────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 2. Start the Backend API (Server)

```bash
cd server
npm install
npm run prisma:generate
npm run dev        # http://localhost:4000
```

- **Health check**: `http://localhost:4000/health`
- **API v1 root**: `http://localhost:4000/api/v1`

### 3. Start the Frontend (Client)

```bash
# In the root project directory:
npm install
npm run dev        # http://localhost:5173
```

Set `VITE_API_BASE_URL=http://localhost:4000` in `.env` to connect directly to the backend.

---

## 🔑 Default Credentials & Role Accounts

The development database is pre-seeded with verified test accounts (all passwords: `Password@123`):

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **ADMIN** | `admin@jyc.ac.in` | `Password@123` | Full platform control, hub management, user roles, global analytics |
| **COORDINATOR** | `coordinator@jyc.ac.in` | `Password@123` | Scoped to **AI & Coding Hub** (events, registrations & attendance) |
| **COORDINATOR** | `sports.coord@jyc.ac.in` | `Password@123` | Scoped to **Sports Hub** (sports tournaments & rosters) |
| **STUDENT** | `student@jyc.ac.in` | `Password@123` | Event browsing, self-registration, cancellation & profile |

---

## 🛡️ Security & Role-Based Access Control (RBAC)

1. **Public Registration**: Public sign-ups strictly create `STUDENT` accounts. Promotion to `COORDINATOR` or `ADMIN` requires server-side administrative workflows.
2. **Cross-Hub Protection**: Coordinators can only create, edit, or mark attendance for events belonging to their assigned hub. Any unauthorized cross-hub action returns `403 Forbidden`.
3. **Double-Booking & Capacity Concurrency**: Event registrations execute within atomic transactions. Registrations verify available seats and increment atomically to prevent race condition overbooking.
4. **Information Disclosure Prevention**: Password reset endpoints return generic messages to prevent email enumeration.

---

## 🧪 Automated Testing

The backend includes comprehensive automated integration tests:

```bash
cd server
npm test
```

### Verified Test Suite:
- [x] Health check status
- [x] Public registration constraint to STUDENT role
- [x] Password hashing & credential validation
- [x] Student role restriction against admin routes (403)
- [x] Cross-hub isolation for coordinators (403)
- [x] Hub-authorized event creation (201)
- [x] Duplicate registration rejection (409 Conflict)
- [x] Registration cancellation & capacity recovery
- [x] Authorized coordinator attendance marking
- [x] Real-time platform analytics aggregation
- [x] Secure password-reset token generation without user leak

---

## 📦 Production Deployment

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_BASE_URL=https://<your-render-backend-url>`

### Backend (Render)
- **Environment**: Node
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT=4000`
  - `NODE_ENV=production`
  - `DATABASE_URL=postgresql://<user>:<password>@<neon-host>/jyc_connect?sslmode=require`
  - `JWT_SECRET=<strong-random-64-char-secret>`
  - `CLIENT_URL=https://<your-vercel-app-url>`

### Database (Neon PostgreSQL)
- Create a serverless PostgreSQL database on Neon.
- Apply schema migrations: `npx prisma migrate deploy`
- Seed initial data: `node prisma/seed.js`
