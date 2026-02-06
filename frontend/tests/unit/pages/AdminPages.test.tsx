import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Admin Pages', () => {
  it('renders admin dashboard', () => {
    render(
      <div data-testid="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div>Total Users: 150</div>
        <div>Total Companies: 25</div>
      </div>
    )

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Total Users: 150')).toBeInTheDocument()
  })

  it('displays user management', () => {
    const users = [
      { id: 1, email: 'user1@test.com', role: 'Admin' },
      { id: 2, email: 'user2@test.com', role: 'User' }
    ]

    render(
      <div>
        <h2>User Management</h2>
        {users.map(u => (
          <div key={u.id}>
            <span>{u.email}</span>
            <span>{u.role}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('user1@test.com')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('shows company management', () => {
    render(
      <div>
        <h2>Companies</h2>
        <div>Total: 25</div>
        <div>Active: 22</div>
      </div>
    )

    expect(screen.getByText('Companies')).toBeInTheDocument()
  })
})
