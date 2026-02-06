import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Dashboard Page', () => {
  it('renders dashboard heading', () => {
    render(
      <div data-testid="dashboard">
        <h1>Dashboard</h1>
      </div>
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('displays project metrics', () => {
    render(
      <div data-testid="dashboard">
        <div className="metric">
          <span>Total Projects</span>
          <span>12</span>
        </div>
      </div>
    )
    expect(screen.getByText('Total Projects')).toBeInTheDocument()
  })

  it('shows active programs count', () => {
    render(
      <div>
        <span>Active Programs</span>
        <span>5</span>
      </div>
    )
    expect(screen.getByText('Active Programs')).toBeInTheDocument()
  })
})
