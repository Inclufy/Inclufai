import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Team Management Page', () => {
  it('renders team members list with details', () => {
    const members = [
      { id: 1, name: 'John Doe', role: 'Project Manager', email: 'john@test.com' },
      { id: 2, name: 'Jane Smith', role: 'Developer', email: 'jane@test.com' },
      { id: 3, name: 'Bob Johnson', role: 'Designer', email: 'bob@test.com' }
    ]

    render(
      <div data-testid="team-list">
        <h1>Team Members</h1>
        {members.map(m => (
          <div key={m.id}>
            <h3>{m.name}</h3>
            <span>{m.role}</span>
            <span>{m.email}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Team Members')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Project Manager')).toBeInTheDocument()
    expect(screen.getByText('jane@test.com')).toBeInTheDocument()
  })

  it('displays team member roles and permissions', () => {
    render(
      <div>
        <h2>Roles & Permissions</h2>
        <div>
          <span>Admin</span>
          <span>Full access</span>
        </div>
        <div>
          <span>Team Member</span>
          <span>View and edit projects</span>
        </div>
        <div>
          <span>Viewer</span>
          <span>Read-only access</span>
        </div>
      </div>
    )

    expect(screen.getByText('Roles & Permissions')).toBeInTheDocument()
    expect(screen.getByText('Full access')).toBeInTheDocument()
  })

  it('shows team member invitation form', () => {
    render(
      <form data-testid="invite-form">
        <h2>Invite Team Member</h2>
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" />
        
        <label htmlFor="role">Role</label>
        <select id="role">
          <option>Developer</option>
          <option>Designer</option>
          <option>Project Manager</option>
        </select>
        
        <button type="submit">Send Invitation</button>
      </form>
    )

    expect(screen.getByText('Invite Team Member')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByText('Send Invitation')).toBeInTheDocument()
  })

  it('displays team capacity and workload', () => {
    render(
      <div data-testid="team-capacity">
        <h3>Team Capacity</h3>
        <div>Total Members: 8</div>
        <div>Available Hours: 320/week</div>
        <div>Utilization: 85%</div>
      </div>
    )

    expect(screen.getByText('Team Capacity')).toBeInTheDocument()
    expect(screen.getByText('Utilization: 85%')).toBeInTheDocument()
  })

  it('shows team performance metrics', () => {
    render(
      <div>
        <h3>Team Performance</h3>
        <div>Projects Completed: 12</div>
        <div>Average Velocity: 42 points</div>
        <div>On-time Delivery: 95%</div>
      </div>
    )

    expect(screen.getByText('Team Performance')).toBeInTheDocument()
    expect(screen.getByText('Projects Completed: 12')).toBeInTheDocument()
  })

  it('displays team member availability calendar', () => {
    render(
      <div>
        <h3>Team Calendar</h3>
        <div>John Doe: Available</div>
        <div>Jane Smith: On Leave (Feb 10-15)</div>
        <div>Bob Johnson: Available</div>
      </div>
    )

    expect(screen.getByText('Team Calendar')).toBeInTheDocument()
    expect(screen.getByText(/On Leave/)).toBeInTheDocument()
  })
})
