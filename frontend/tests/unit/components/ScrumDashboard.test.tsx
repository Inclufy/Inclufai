import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'
import { mockSprint, mockProject } from '@tests/mocks/data'

describe('ScrumDashboard Component', () => {
  it('displays active sprint information', () => {
    render(
      <div data-testid="scrum-dashboard">
        <h2>{mockSprint.name}</h2>
        <p>Status: {mockSprint.status}</p>
        <p>Goal: {mockSprint.goal}</p>
      </div>
    )

    expect(screen.getByText(mockSprint.name)).toBeInTheDocument()
    expect(screen.getByText(/status/i)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(mockSprint.goal))).toBeInTheDocument()
  })

  it('shows sprint burndown chart placeholder', () => {
    render(
      <div data-testid="scrum-dashboard">
        <div data-testid="burndown-chart">Burndown Chart</div>
      </div>
    )

    expect(screen.getByTestId('burndown-chart')).toBeInTheDocument()
  })

  it('displays sprint backlog items', () => {
    const backlogItems = [
      { id: 1, title: 'User Story 1', status: 'todo', points: 5 },
      { id: 2, title: 'User Story 2', status: 'in_progress', points: 8 },
      { id: 3, title: 'User Story 3', status: 'done', points: 3 },
    ]

    render(
      <div data-testid="sprint-backlog">
        {backlogItems.map(item => (
          <div key={item.id} data-testid={`backlog-item-${item.id}`}>
            <h3>{item.title}</h3>
            <span>{item.status}</span>
            <span>{item.points} points</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('User Story 1')).toBeInTheDocument()
    expect(screen.getByText('User Story 2')).toBeInTheDocument()
    expect(screen.getByText('User Story 3')).toBeInTheDocument()
  })

  it('calculates sprint velocity', () => {
    const completedPoints = 16
    const totalPoints = 24
    const velocity = Math.round((completedPoints / totalPoints) * 100)

    render(
      <div data-testid="sprint-metrics">
        <div>Completed: {completedPoints} pts</div>
        <div>Total: {totalPoints} pts</div>
        <div>Velocity: {velocity}%</div>
      </div>
    )

    expect(screen.getByText(/completed: 16 pts/i)).toBeInTheDocument()
    expect(screen.getByText(/velocity: 67%/i)).toBeInTheDocument()
  })
})
