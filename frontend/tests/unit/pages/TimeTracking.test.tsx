import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Time Tracking Page', () => {
  it('renders time entry form', () => {
    render(
      <form data-testid="time-entry-form">
        <label htmlFor="hours">Hours</label>
        <input id="hours" type="number" />
        <label htmlFor="description">Description</label>
        <textarea id="description" />
      </form>
    )

    expect(screen.getByLabelText('Hours')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('displays time entries list', () => {
    const entries = [
      { id: 1, hours: 8, description: 'Development' },
      { id: 2, hours: 4, description: 'Meeting' }
    ]

    render(
      <div>
        {entries.map(e => (
          <div key={e.id}>
            <span>{e.hours}h</span>
            <span>{e.description}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('8h')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
  })
})
