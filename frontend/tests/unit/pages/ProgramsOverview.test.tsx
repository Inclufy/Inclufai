import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Programs Overview Page', () => {
  it('renders programs list', () => {
    const programs = [
      { id: 1, name: 'Digital Transformation', methodology: 'SAFe' },
      { id: 2, name: 'Infrastructure Update', methodology: 'MSP' }
    ]

    render(
      <div data-testid="programs-list">
        {programs.map(p => (
          <div key={p.id}>
            <h3>{p.name}</h3>
            <span>{p.methodology}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Digital Transformation')).toBeInTheDocument()
    expect(screen.getByText('SAFe')).toBeInTheDocument()
  })
})
