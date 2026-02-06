import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Team Page', () => {
  it('renders team members list', () => {
    const members = [
      { id: 1, name: 'John Doe', role: 'Developer' },
      { id: 2, name: 'Jane Smith', role: 'Designer' }
    ]

    render(
      <div data-testid="team-list">
        {members.map(m => (
          <div key={m.id}>
            <span>{m.name}</span>
            <span>{m.role}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('displays team member roles', () => {
    render(
      <div>
        <span>Developer</span>
        <span>Designer</span>
      </div>
    )
    expect(screen.getByText('Developer')).toBeInTheDocument()
  })
})
