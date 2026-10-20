import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../src/app.js'
import { db } from '../src/db/prisma.js'

// Simple helper to invoke express app handler in tests
async function request(method, path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = {
      method,
      url: path,
      originalUrl: path,
      headers: {
        'content-type': 'application/json',
        ...headers
      },
      body: body || {},
      query: {},
      cookies: {},
      socket: { remoteAddress: '127.0.0.1' },
      connection: { remoteAddress: '127.0.0.1' }
    }

    // Parse query params if any
    if (path.includes('?')) {
      const [p, q] = path.split('?')
      req.url = p
      req.originalUrl = p
      req.query = Object.fromEntries(new URLSearchParams(q))
    }

    let statusCode = 200
    let resHeaders = {}
    let resBody = null

    const res = {
      status(code) {
        statusCode = code
        return this
      },
      setHeader(k, v) {
        resHeaders[k] = v
        return this
      },
      getHeader(k) {
        return resHeaders[k]
      },
      json(data) {
        resBody = data
        resolve({ status: statusCode, body: data, headers: resHeaders })
      },
      send(data) {
        resBody = data
        resolve({ status: statusCode, body: data, headers: resHeaders })
      },
      end() {
        resolve({ status: statusCode, body: resBody, headers: resHeaders })
      }
    }

    try {
      app(req, res, (err) => {
        if (err) reject(err)
        else resolve({ status: 404, body: { error: 'NotFound' } })
      })
    } catch (e) {
      reject(e)
    }
  })
}

test('API Test Suite: Security, RBAC, Concurrency & Domain Workflows', async (t) => {
  // Reset database state before testing
  db.reset()

  let studentToken = null
  let coordToken = null
  let adminToken = null

  await t.test('1. Health check returns healthy status', async () => {
    const res = await request('GET', '/health')
    assert.equal(res.status, 200)
    assert.equal(res.body.status, 'healthy')
  })

  await t.test('2. Public registration creates STUDENT account only', async () => {
    const res = await request('POST', '/api/v1/auth/register', {
      body: {
        name: 'Test Student',
        email: 'test.student@jyc.ac.in',
        password: 'Password@123',
        rollNumber: '241B999',
        department: 'CSE'
      }
    })
    assert.equal(res.status, 201)
    assert.equal(res.body.user.role, 'STUDENT')
    assert.ok(res.body.token)
    assert.equal(res.body.user.passwordHash, undefined) // Never leak hash
    studentToken = res.body.token
  })

  await t.test('3. Login handles valid and invalid credentials correctly', async () => {
    // Bad credentials
    const badRes = await request('POST', '/api/v1/auth/login', {
      body: { email: 'admin@jyc.ac.in', password: 'WrongPassword' }
    })
    assert.equal(badRes.status, 401)

    // Admin login
    const adminRes = await request('POST', '/api/v1/auth/login', {
      body: { email: 'admin@jyc.ac.in', password: 'Password@123' }
    })
    assert.equal(adminRes.status, 200)
    assert.equal(adminRes.body.user.role, 'ADMIN')
    adminToken = adminRes.body.token

    // Coordinator login
    const coordRes = await request('POST', '/api/v1/auth/login', {
      body: { email: 'coordinator@jyc.ac.in', password: 'Password@123' }
    })
    assert.equal(coordRes.status, 200)
    assert.equal(coordRes.body.user.role, 'COORDINATOR')
    coordToken = coordRes.body.token
  })

  await t.test('4. Authorization: Student cannot access Admin or Coordinator endpoints', async () => {
    const res = await request('GET', '/api/v1/admin/analytics', {
      headers: { authorization: `Bearer ${studentToken}` }
    })
    assert.equal(res.status, 403)
  })

  await t.test('5. Cross-Hub Access Restriction: Coordinator cannot create events for unauthorized hubs', async () => {
    // Coordinator Rohan Verma is assigned to 'hub-3' (AI & Coding Hub).
    // Attempting to create an event for 'hub-1' (Cultural Hub) must be rejected with 403.
    const res = await request('POST', '/api/v1/events', {
      headers: { authorization: `Bearer ${coordToken}` },
      body: {
        title: 'Unauthorized Music Night',
        hubId: 'hub-1', // Cultural Hub
        date: '2026-11-30',
        venue: 'Auditorium'
      }
    })
    assert.equal(res.status, 403)
    assert.match(res.body.message, /not authorized to create events for this hub/i)
  })

  await t.test('6. Coordinator CAN create events for their assigned hub', async () => {
    const res = await request('POST', '/api/v1/events', {
      headers: { authorization: `Bearer ${coordToken}` },
      body: {
        title: 'AI Prompt Engineering Workshop',
        hubId: 'hub-3', // AI & Coding Hub
        category: 'Technology',
        type: 'Workshop',
        date: '2026-11-25',
        startTime: '02:00 PM',
        endTime: '05:00 PM',
        venue: 'Lab 3',
        capacity: 2
      }
    })
    assert.equal(res.status, 201)
    assert.equal(res.body.title, 'AI Prompt Engineering Workshop')
  })

  await t.test('7. Duplicate registration prevention (409 Conflict)', async () => {
    // First registration for student Aarav (usr-student-1 is already registered for ev-techfest-2026 in mock)
    // Register our test student for ev-techfest-2026
    const res1 = await request('POST', '/api/v1/events/ev-techfest-2026/register', {
      headers: { authorization: `Bearer ${studentToken}` }
    })
    assert.equal(res1.status, 201)

    // Attempting to register again must yield 409 Conflict
    const res2 = await request('POST', '/api/v1/events/ev-techfest-2026/register', {
      headers: { authorization: `Bearer ${studentToken}` }
    })
    assert.equal(res2.status, 409)
    assert.match(res2.body.message, /already registered/i)
  })

  await t.test('8. Registration cancellation frees up event capacity', async () => {
    const eventBefore = db.findEventById('ev-techfest-2026')
    const countBefore = eventBefore.registeredCount

    const res = await request('POST', '/api/v1/events/ev-techfest-2026/cancel', {
      headers: { authorization: `Bearer ${studentToken}` }
    })
    assert.equal(res.status, 200)

    const eventAfter = db.findEventById('ev-techfest-2026')
    assert.equal(eventAfter.registeredCount, countBefore - 1)
  })

  await t.test('9. Attendance marking works for authorized coordinator', async () => {
    // Aarav (usr-student-1) has reg-1 on ev-techfest-2026
    const res = await request('POST', '/api/v1/attendance/ev-techfest-2026/mark', {
      headers: { authorization: `Bearer ${coordToken}` },
      body: {
        registrationId: 'reg-1',
        status: 'PRESENT'
      }
    })
    assert.equal(res.status, 200)
    assert.equal(res.body.attendance.status, 'PRESENT')
  })

  await t.test('10. Admin Analytics endpoint aggregates real platform totals', async () => {
    const res = await request('GET', '/api/v1/admin/analytics', {
      headers: { authorization: `Bearer ${adminToken}` }
    })
    assert.equal(res.status, 200)
    assert.ok(res.body.totals.totalUsers >= 4)
    assert.ok(res.body.totals.totalEvents >= 4)
    assert.equal(res.body.hubStats.length, 10)
  })

  await t.test('11. Forgot password endpoint does not leak user existence', async () => {
    const res = await request('POST', '/api/v1/auth/forgot-password', {
      body: { email: 'nonexistent.person@unknown.com' }
    })
    assert.equal(res.status, 200)
    assert.match(res.body.message, /If an account matches that email/i)
  })
})
