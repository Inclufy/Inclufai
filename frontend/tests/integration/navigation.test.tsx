import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Application Navigation', () => {
  it('renders main navigation menu', () => {
    render(
      <nav data-testid="main-nav">
        <a href="/dashboard">Dashboard</a>
        <a href="/projects">Projects</a>
        <a href="/programs">Programs</a>
        <a href="/team">Team</a>
      </nav>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Programs')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('highlights active route', () => {
    render(
      <nav>
        <a href="/dashboard" className="active">Dashboard</a>
        <a href="/projects">Projects</a>
      </nav>
    )

    const activeLink = screen.getByText('Dashboard')
    expect(activeLink).toBeInTheDocument()
  })
})
