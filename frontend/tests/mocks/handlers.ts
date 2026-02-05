import { http, HttpResponse } from 'msw'
import { mockUser, mockProject, mockSprint } from './data'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const handlers = [
  // Auth
  http.post(`${API_URL}/api/v1/auth/login/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: mockUser,
    })
  }),

  http.get(`${API_URL}/api/v1/auth/user/`, () => {
    return HttpResponse.json(mockUser)
  }),

  // Projects
  http.get(`${API_URL}/api/v1/projects/`, () => {
    return HttpResponse.json([mockProject])
  }),

  http.post(`${API_URL}/api/v1/projects/`, () => {
    return HttpResponse.json(mockProject)
  }),

  // Sprints
  http.get(`${API_URL}/api/v1/projects/:projectId/scrum/sprints/`, () => {
    return HttpResponse.json([mockSprint])
  }),
]
