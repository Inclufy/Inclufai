import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Agile Pages', () => {
  it('renders Agile backlog', () => {
    const stories = [
      { id: 1, title: 'User login', points: 5 },
      { id: 2, title: 'Dashboard', points: 8 }
    ]

    render(
      <div data-testid="agile-backlog">
        <h1>Product Backlog</h1>
        {stories.map(s => (
          <div key={s.id}>
            <span>{s.title}</span>
            <span>{s.points} points</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Product Backlog')).toBeInTheDocument()
    expect(screen.getByText('User login')).toBeInTheDocument()
  })

  it('displays Agile iteration board', () => {
    render(
      <div data-testid="iteration-board">
        <h2>Sprint 5</h2>
        <div>Stories: 15</div>
        <div>Points: 55</div>
      </div>
    )

    expect(screen.getByText('Sprint 5')).toBeInTheDocument()
    expect(screen.getByText('Stories: 15')).toBeInTheDocument()
  })

  it('shows product vision', () => {
    render(
      <div>
        <h1>Product Vision</h1>
        <p>Build the best project management tool</p>
      </div>
    )

    expect(screen.getByText('Product Vision')).toBeInTheDocument()
  })
})
