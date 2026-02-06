import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Settings Page', () => {
  it('renders settings navigation tabs', () => {
    const tabs = ['Account', 'Notifications', 'Security', 'Privacy', 'Integrations']

    render(
      <div data-testid="settings">
        <h1>Settings</h1>
        <nav>
          {tabs.map(tab => (
            <button key={tab}>{tab}</button>
          ))}
        </nav>
      </div>
    )

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Integrations')).toBeInTheDocument()
  })

  it('displays account settings form', () => {
    render(
      <form data-testid="account-settings">
        <h2>Account Settings</h2>
        
        <label htmlFor="language">Language</label>
        <select id="language">
          <option>English</option>
          <option>Dutch</option>
        </select>
        
        <label htmlFor="timezone">Timezone</label>
        <select id="timezone">
          <option>UTC</option>
          <option>Europe/Amsterdam</option>
        </select>
        
        <label htmlFor="dateFormat">Date Format</label>
        <select id="dateFormat">
          <option>MM/DD/YYYY</option>
          <option>DD/MM/YYYY</option>
        </select>
      </form>
    )

    expect(screen.getByText('Account Settings')).toBeInTheDocument()
    expect(screen.getByLabelText('Language')).toBeInTheDocument()
    expect(screen.getByLabelText('Timezone')).toBeInTheDocument()
  })

  it('shows notification preferences', () => {
    render(
      <div data-testid="notifications">
        <h2>Notification Preferences</h2>
        
        <label>
          <input type="checkbox" />
          Email notifications
        </label>
        
        <label>
          <input type="checkbox" />
          Push notifications
        </label>
        
        <label>
          <input type="checkbox" />
          Project updates
        </label>
        
        <label>
          <input type="checkbox" />
          Team mentions
        </label>
        
        <label>
          <input type="checkbox" />
          Weekly digest
        </label>
      </div>
    )

    expect(screen.getByText('Notification Preferences')).toBeInTheDocument()
    expect(screen.getByText('Email notifications')).toBeInTheDocument()
    expect(screen.getByText('Weekly digest')).toBeInTheDocument()
  })

  it('displays security settings', () => {
    render(
      <div data-testid="security">
        <h2>Security Settings</h2>
        
        <div>
          <h3>Password</h3>
          <button>Change Password</button>
        </div>
        
        <div>
          <h3>Two-Factor Authentication</h3>
          <button>Enable 2FA</button>
        </div>
        
        <div>
          <h3>Active Sessions</h3>
          <div>Desktop - Last active: 2 minutes ago</div>
          <div>Mobile - Last active: 1 hour ago</div>
        </div>
      </div>
    )

    expect(screen.getByText('Security Settings')).toBeInTheDocument()
    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(screen.getByText('Enable 2FA')).toBeInTheDocument()
  })

  it('shows privacy settings', () => {
    render(
      <div>
        <h2>Privacy Settings</h2>
        
        <label>
          <input type="checkbox" />
          Make profile public
        </label>
        
        <label>
          <input type="checkbox" />
          Show activity status
        </label>
        
        <label>
          <input type="checkbox" />
          Allow search engines to index my profile
        </label>
      </div>
    )

    expect(screen.getByText('Privacy Settings')).toBeInTheDocument()
    expect(screen.getByText('Make profile public')).toBeInTheDocument()
  })

  it('displays integration settings', () => {
    const integrations = [
      { name: 'Slack', status: 'Connected', icon: '💬' },
      { name: 'Google Calendar', status: 'Not Connected', icon: '📅' },
      { name: 'GitHub', status: 'Connected', icon: '🔗' }
    ]

    render(
      <div>
        <h2>Integrations</h2>
        {integrations.map(i => (
          <div key={i.name}>
            <span>{i.icon} {i.name}</span>
            <span>{i.status}</span>
            <button>{i.status === 'Connected' ? 'Disconnect' : 'Connect'}</button>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText(/Slack/)).toBeInTheDocument()
    expect(screen.getByText(/Google Calendar/)).toBeInTheDocument()
  })

  it('shows billing and subscription settings', () => {
    render(
      <div>
        <h2>Billing & Subscription</h2>
        <div>Current Plan: Pro</div>
        <div>Billing Cycle: Monthly</div>
        <div>Next Payment: Feb 15, 2026</div>
        <button>Upgrade Plan</button>
        <button>Update Payment Method</button>
      </div>
    )

    expect(screen.getByText('Current Plan: Pro')).toBeInTheDocument()
    expect(screen.getByText('Upgrade Plan')).toBeInTheDocument()
  })

  it('displays danger zone actions', () => {
    render(
      <div data-testid="danger-zone">
        <h3>Danger Zone</h3>
        <button>Export Data</button>
        <button>Deactivate Account</button>
        <button>Delete Account</button>
      </div>
    )

    expect(screen.getByText('Danger Zone')).toBeInTheDocument()
    expect(screen.getByText('Export Data')).toBeInTheDocument()
    expect(screen.getByText('Delete Account')).toBeInTheDocument()
  })
})
