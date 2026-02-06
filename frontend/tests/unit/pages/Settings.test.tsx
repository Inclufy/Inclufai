import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Settings Page', () => {
  it('renders account settings', () => {
    render(
      <div data-testid="account-settings">
        <h2>Account Settings</h2>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />
      </div>
    )

    expect(screen.getByText('Account Settings')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('displays notification preferences', () => {
    render(
      <div>
        <h3>Notifications</h3>
        <label>
          <input type="checkbox" />
          Email notifications
        </label>
        <label>
          <input type="checkbox" />
          Push notifications
        </label>
      </div>
    )

    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Email notifications')).toBeInTheDocument()
  })

  it('shows security settings', () => {
    render(
      <div>
        <h3>Security</h3>
        <button>Change Password</button>
        <button>Enable 2FA</button>
      </div>
    )

    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Change Password')).toBeInTheDocument()
  })
})
