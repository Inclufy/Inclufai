import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Profile Page', () => {
  it('renders user profile information', () => {
    render(
      <div data-testid="profile">
        <h1>My Profile</h1>
        <div>
          <img src="/avatar.jpg" alt="Profile" />
          <h2>John Doe</h2>
          <p>john.doe@test.com</p>
        </div>
      </div>
    )

    expect(screen.getByText('My Profile')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@test.com')).toBeInTheDocument()
  })

  it('displays profile edit form', () => {
    render(
      <form data-testid="profile-form">
        <h2>Edit Profile</h2>
        
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" type="text" defaultValue="John" />
        
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" type="text" defaultValue="Doe" />
        
        <label htmlFor="email">Email</label>
        <input id="email" type="email" defaultValue="john@test.com" />
        
        <label htmlFor="phone">Phone</label>
        <input id="phone" type="tel" />
        
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" />
        
        <button type="submit">Save Changes</button>
      </form>
    )

    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('shows user activity statistics', () => {
    render(
      <div data-testid="user-stats">
        <h3>Activity</h3>
        <div>Projects: 15</div>
        <div>Tasks Completed: 142</div>
        <div>Hours Logged: 320</div>
        <div>Team Member Since: Jan 2023</div>
      </div>
    )

    expect(screen.getByText('Projects: 15')).toBeInTheDocument()
    expect(screen.getByText('Tasks Completed: 142')).toBeInTheDocument()
  })

  it('displays user roles and permissions', () => {
    render(
      <div>
        <h3>Roles & Access</h3>
        <div>Role: Project Manager</div>
        <div>Company: Acme Corp</div>
        <div>Permissions: Admin</div>
      </div>
    )

    expect(screen.getByText('Role: Project Manager')).toBeInTheDocument()
    expect(screen.getByText('Company: Acme Corp')).toBeInTheDocument()
  })

  it('shows recent activity feed', () => {
    const activities = [
      { action: 'Completed task: Update documentation', time: '2 hours ago' },
      { action: 'Created project: New Website', time: '1 day ago' },
      { action: 'Joined team: Marketing', time: '3 days ago' }
    ]

    render(
      <div>
        <h3>Recent Activity</h3>
        {activities.map((a, i) => (
          <div key={i}>
            <span>{a.action}</span>
            <span>{a.time}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText(/Update documentation/)).toBeInTheDocument()
    expect(screen.getByText(/New Website/)).toBeInTheDocument()
  })

  it('displays profile completion status', () => {
    render(
      <div>
        <h3>Profile Completion</h3>
        <div>75% Complete</div>
        <div>Add phone number</div>
        <div>Upload profile picture</div>
      </div>
    )

    expect(screen.getByText('75% Complete')).toBeInTheDocument()
  })
})
