# JYC Connect — Backend API Server

High-performance, modular monolithic REST API built for Jaypee Youth Club (JYC) with Node.js, Express, ES modules, and Prisma ORM for PostgreSQL.

## Directory Structure

```
server/
├── prisma/
│   ├── schema.prisma         # Prisma PostgreSQL relational schema
│   └── seed.js               # Production seed script for 10 hubs & initial accounts
├── src/
│   ├── config/               # Environment variable validation & constants
│   ├── db/                   # Prisma Client bridge & transactional store
│   ├── middleware/           # JWT authentication, RBAC guards, error handling
│   ├── modules/
│   │   ├── auth/             # Login, register, forgot-password, reset-password
│   │   ├── hubs/             # 10 official hubs CRUD & coordinator lookup
│   │   ├── events/           # Events CRUD, concurrency-safe registration & cancellation
│   │   ├── attendance/       # Attendance tracking & batch verification
│   │   ├── registrations/    # Student registration lookup
│   │   ├── announcements/    # University & hub announcements
│   │   ├── gallery/          # Campus event photo management
│   │   ├── team/             # Student leadership & advisor directory
│   │   └── admin/            # Platform analytics & user role management
│   ├── app.js                # Express app configuration & route mounting
│   └── server.js             # HTTP server entry point
├── tests/
│   └── api.test.js           # Automated integration test suite
├── .env.example              # Environment variables template
└── package.json
```

## Running Locally

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run tests
npm test

# Start server in watch mode
npm run dev
```

## API Endpoints Reference

### Public & Student Endpoints
- `GET /health` — Service health & uptime
- `POST /api/v1/auth/register` — Register as student
- `POST /api/v1/auth/login` — Authenticate and receive JWT
- `GET /api/v1/auth/me` — Current user profile
- `GET /api/v1/hubs` — List all 10 hubs
- `GET /api/v1/hubs/:slug` — Single hub details with events
- `GET /api/v1/events` — Filter and search events
- `GET /api/v1/events/:id` — Event details
- `POST /api/v1/events/:id/register` — Register for event (concurrency safe)
- `POST /api/v1/events/:id/cancel` — Cancel registration
- `GET /api/v1/registrations/my` — Current student registrations
- `GET /api/v1/announcements` — Official announcements
- `GET /api/v1/gallery` — Campus gallery photos
- `GET /api/v1/team` — Leadership directory

### Coordinator Endpoints (Requires COORDINATOR role)
- `POST /api/v1/events` — Create event for assigned hub
- `PATCH /api/v1/events/:id` — Edit event for assigned hub
- `GET /api/v1/events/:id/registrations` — View participant roster
- `POST /api/v1/attendance/:eventId/mark` — Mark participant attendance (single / batch)
- `POST /api/v1/announcements` — Post hub announcement

### Admin Endpoints (Requires ADMIN role)
- `GET /api/v1/admin/analytics` — Platform KPI metrics and hub engagement stats
- `GET /api/v1/admin/users` — User directory with search & role filters
- `PATCH /api/v1/admin/users/:id/role` — Modify user role (`STUDENT`, `COORDINATOR`, `ADMIN`)
- `POST /api/v1/admin/coordinators` — Assign coordinator to hub
- `DELETE /api/v1/admin/coordinators/:id` — Remove coordinator assignment
- `POST /api/v1/hubs` & `PATCH /api/v1/hubs/:slug` — Manage hub metadata
- `POST /api/v1/gallery` & `DELETE /api/v1/gallery/:id` — Manage gallery photos
- `POST /api/v1/team` & `DELETE /api/v1/team/:id` — Manage team members
