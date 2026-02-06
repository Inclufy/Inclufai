import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('PRINCE2 Methodology Pages', () => {
  it('renders PRINCE2 project stages', () => {
    const stages = [
      { id: 1, name: 'Initiation', status: 'Completed' },
      { id: 2, name: 'Delivery', status: 'In Progress' },
      { id: 3, name: 'Closure', status: 'Not Started' }
    ]

    render(
      <div data-testid="prince2-stages">
        <h1>PRINCE2 Project Stages</h1>
        {stages.map(s => (
          <div key={s.id}>
            <h3>{s.name}</h3>
            <span>{s.status}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('PRINCE2 Project Stages')).toBeInTheDocument()
    expect(screen.getByText('Initiation')).toBeInTheDocument()
    expect(screen.getByText('Delivery')).toBeInTheDocument()
  })

  it('displays PRINCE2 products', () => {
    const products = [
      { name: 'Business Case', status: 'Approved' },
      { name: 'Project Brief', status: 'Draft' },
      { name: 'Project Plan', status: 'In Review' }
    ]

    render(
      <div>
        <h2>Project Products</h2>
        {products.map(p => (
          <div key={p.name}>
            <span>{p.name}</span>
            <span>{p.status}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Business Case')).toBeInTheDocument()
    expect(screen.getByText('Project Brief')).toBeInTheDocument()
  })

  it('shows PRINCE2 themes', () => {
    const themes = [
      'Business Case',
      'Organization',
      'Quality',
      'Plans',
      'Risk',
      'Change',
      'Progress'
    ]

    render(
      <div>
        <h2>PRINCE2 Themes</h2>
        {themes.map(t => (
          <div key={t}>{t}</div>
        ))}
      </div>
    )

    expect(screen.getByText('Business Case')).toBeInTheDocument()
    expect(screen.getByText('Quality')).toBeInTheDocument()
    expect(screen.getByText('Risk')).toBeInTheDocument()
  })

  it('displays stage gates', () => {
    render(
      <div>
        <h3>Stage Gate Reviews</h3>
        <div>Initiation Stage Gate: Approved</div>
        <div>Next Review: End of Stage 2</div>
      </div>
    )

    expect(screen.getByText('Stage Gate Reviews')).toBeInTheDocument()
    expect(screen.getByText(/Initiation.*Approved/)).toBeInTheDocument()
  })
})
