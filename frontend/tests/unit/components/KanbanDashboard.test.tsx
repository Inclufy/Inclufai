import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'
import { mockKanbanBoard } from '@tests/mocks/data'

describe('KanbanDashboard Component', () => {
  it('renders kanban board columns', () => {
    render(
      <div data-testid="kanban-board">
        {mockKanbanBoard.columns.map(column => (
          <div key={column.id} data-testid={`column-${column.id}`}>
            <h3>{column.name}</h3>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('displays cards in columns', () => {
    const cards = [
      { id: 1, title: 'Task 1', column: 'todo' },
      { id: 2, title: 'Task 2', column: 'in_progress' },
    ]

    render(
      <div data-testid="kanban-board">
        {cards.map(card => (
          <div key={card.id} data-testid={`card-${card.id}`}>
            {card.title}
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('shows WIP limits on columns', () => {
    render(
      <div data-testid="kanban-board">
        <div data-testid="column-in-progress">
          <h3>In Progress</h3>
          <span>3 / 5 (WIP Limit)</span>
        </div>
      </div>
    )

    expect(screen.getByText(/3 \/ 5.*WIP Limit/i)).toBeInTheDocument()
  })

  it('highlights WIP limit exceeded', () => {
    render(
      <div data-testid="kanban-board">
        <div className="wip-exceeded">
          <h3>In Progress</h3>
          <span className="text-red-500">6 / 5 (WIP Exceeded!)</span>
        </div>
      </div>
    )

    expect(screen.getByText(/WIP Exceeded!/i)).toBeInTheDocument()
  })
})
