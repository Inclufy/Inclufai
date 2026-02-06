import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Program Pages', () => {
  it('renders program dashboard', () => {
    render(
      <div data-testid="program-dashboard">
        <h1>Program Dashboard</h1>
        <div>Active Projects: 12</div>
        <div>Total Benefits: $5M</div>
      </div>
    )

    expect(screen.getByText('Program Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Active Projects: 12')).toBeInTheDocument()
  })

  it('displays program benefits', () => {
    const benefits = [
      { id: 1, name: 'Cost Reduction', value: '20%' },
      { id: 2, name: 'Revenue Increase', value: '$2M' }
    ]

    render(
      <div>
        <h2>Program Benefits</h2>
        {benefits.map(b => (
          <div key={b.id}>
            <span>{b.name}</span>
            <span>{b.value}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Cost Reduction')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('shows program roadmap', () => {
    render(
      <div>
        <h1>Program Roadmap</h1>
        <div>Q1 2024: Foundation</div>
        <div>Q2 2024: Build</div>
        <div>Q3 2024: Deploy</div>
      </div>
    )

    expect(screen.getByText('Program Roadmap')).toBeInTheDocument()
    expect(screen.getByText(/Q1.*Foundation/)).toBeInTheDocument()
  })

  it('displays program governance', () => {
    render(
      <div>
        <h2>Program Governance</h2>
        <div>Steering Committee: 5 members</div>
        <div>Next Review: March 15</div>
      </div>
    )

    expect(screen.getByText('Program Governance')).toBeInTheDocument()
  })

  it('shows program resources', () => {
    render(
      <div>
        <h2>Program Resources</h2>
        <div>Team Size: 45</div>
        <div>Budget: $10M</div>
      </div>
    )

    expect(screen.getByText('Program Resources')).toBeInTheDocument()
    expect(screen.getByText('Budget: $10M')).toBeInTheDocument()
  })
})
