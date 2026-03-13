import { test, expect } from '@playwright/test'

const BASE_URL = process.env.API_URL || 'http://localhost:8083'

test.describe('Mobile App - API Endpoints', () => {
  let token: string | null = null

  test('health check endpoint responds', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/health/`)
    expect(res.ok()).toBeTruthy()
  })

  test('API schema endpoint responds', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/schema/`)
    expect(res.ok()).toBeTruthy()
  })

  test('can authenticate via login API', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: {
        email: 'test@example.com',
        password: 'password123',
      },
    })
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    token = data.access || data.token || data.key
    expect(token).toBeTruthy()
  })

  test('can fetch user profile', async ({ request }) => {
    // Login first
    const loginRes = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: { email: 'test@example.com', password: 'password123' },
    })
    const loginData = await loginRes.json()
    const authToken = loginData.access || loginData.token || loginData.key

    const res = await request.get(`${BASE_URL}/api/v1/users/me/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    expect(res.ok()).toBeTruthy()
    const user = await res.json()
    expect(user.email).toBeTruthy()
  })

  test('can list projects', async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: { email: 'test@example.com', password: 'password123' },
    })
    const loginData = await loginRes.json()
    const authToken = loginData.access || loginData.token || loginData.key

    const res = await request.get(`${BASE_URL}/api/v1/projects/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('can list tasks', async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: { email: 'test@example.com', password: 'password123' },
    })
    const loginData = await loginRes.json()
    const authToken = loginData.access || loginData.token || loginData.key

    const res = await request.get(`${BASE_URL}/api/v1/projects/tasks/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('can list academy courses', async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: { email: 'test@example.com', password: 'password123' },
    })
    const loginData = await loginRes.json()
    const authToken = loginData.access || loginData.token || loginData.key

    const res = await request.get(`${BASE_URL}/api/v1/academy/courses/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('can list programs', async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: { email: 'test@example.com', password: 'password123' },
    })
    const loginData = await loginRes.json()
    const authToken = loginData.access || loginData.token || loginData.key

    const res = await request.get(`${BASE_URL}/api/v1/programs/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('can access bot/chat endpoint', async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: { email: 'test@example.com', password: 'password123' },
    })
    const loginData = await loginRes.json()
    const authToken = loginData.access || loginData.token || loginData.key

    const res = await request.get(`${BASE_URL}/api/v1/bot/chats/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('can access newsletters endpoint', async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: { email: 'test@example.com', password: 'password123' },
    })
    const loginData = await loginRes.json()
    const authToken = loginData.access || loginData.token || loginData.key

    const res = await request.get(`${BASE_URL}/api/v1/newsletters/newsletters/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('can access subscriptions endpoint', async ({ request }) => {
    const loginRes = await request.post(`${BASE_URL}/api/v1/auth/login/`, {
      data: { email: 'test@example.com', password: 'password123' },
    })
    const loginData = await loginRes.json()
    const authToken = loginData.access || loginData.token || loginData.key

    const res = await request.get(`${BASE_URL}/api/v1/subscriptions/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    expect(res.ok()).toBeTruthy()
  })
})
