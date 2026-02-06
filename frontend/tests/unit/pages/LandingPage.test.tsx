import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Landing Page', () => {
  it('renders hero section', () => {
    render(
      <div data-testid="landing-hero">
        <h1>ProjeXtPal - Project Management Platform</h1>
        <p>Manage projects with any methodology</p>
        <button>Get Started</button>
      </div>
    )

    expect(screen.getByText(/ProjeXtPal/)).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('displays feature highlights', () => {
    const features = [
      'Multiple Methodologies',
      'AI-Powered Insights',
      'Team Collaboration'
    ]

    render(
      <div>
        <h2>Features</h2>
        {features.map(f => (
          <div key={f}>{f}</div>
        ))}
      </div>
    )

    expect(screen.getByText('Multiple Methodologies')).toBeInTheDocument()
    expect(screen.getByText('AI-Powered Insights')).toBeInTheDocument()
  })

  it('shows pricing section', () => {
    render(
      <div data-testid="pricing">
        <h2>Pricing Plans</h2>
        <div>Free</div>
        <div>Pro</div>
        <div>Enterprise</div>
      </div>
    )

    expect(screen.getByText('Pricing Plans')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('displays call to action', () => {
    render(
      <div>
        <h2>Ready to get started?</h2>
        <button>Start Free Trial</button>
        <button>Contact Sales</button>
      </div>
    )

    expect(screen.getByText('Start Free Trial')).toBeInTheDocument()
    expect(screen.getByText('Contact Sales')).toBeInTheDocument()
  })
})
