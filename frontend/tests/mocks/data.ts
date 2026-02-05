export const mockUser = {
  id: 1,
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  company: 1,
  role: 'admin',
}

export const mockCompany = {
  id: 1,
  name: 'Test Company',
  subscription_tier: 'professional',
}

export const mockProject = {
  id: 1,
  name: 'Test Project',
  description: 'A test project',
  methodology: 'scrum',
  status: 'active',
  company: 1,
}

export const mockSprint = {
  id: 1,
  name: 'Sprint 1',
  project: 1,
  start_date: '2024-01-01',
  end_date: '2024-01-14',
  status: 'active',
  goal: 'Complete user stories',
}

export const mockKanbanBoard = {
  id: 1,
  name: 'Development Board',
  project: 1,
  columns: [
    { id: 1, name: 'To Do', order: 1 },
    { id: 2, name: 'In Progress', order: 2 },
    { id: 3, name: 'Done', order: 3 },
  ],
}
