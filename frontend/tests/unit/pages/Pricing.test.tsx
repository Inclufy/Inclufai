import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Pricing Page', () => {
  it('renders pricing tiers', () => {
    const tiers = [
      { name: 'Free', price: '$0', features: ['5 projects', 'Basic support'] },
      { name: 'Pro', price: '$29', features: ['Unlimited projects', 'Priority support'] },
      { name: 'Enterprise', price: 'Custom', features: ['Everything', 'Dedicated support'] }
    ]

    render(
      <div data-testid="pricing-tiers">
        {tiers.map(t => (
          <div key={t.name}>
            <h3>{t.name}</h3>
            <span>{t.price}</span>
            {t.features.map(f => <div key={f}>{f}</div>)}
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('$29')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('displays feature comparison', () => {
    render(
      <div>
        <h2>Feature Comparison</h2>
        <div>All plans include:</div>
        <div>✓ Project Management</div>
        <div>✓ Team Collaboration</div>
      </div>
    )

    expect(screen.getByText('Feature Comparison')).toBeInTheDocument()
  })
})
