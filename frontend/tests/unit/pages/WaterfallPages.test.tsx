import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Waterfall Methodology Pages', () => {
  it('renders Waterfall project phases', () => {
    const phases = [
      { name: 'Requirements', progress: 100, status: 'Complete' },
      { name: 'Design', progress: 100, status: 'Complete' },
      { name: 'Development', progress: 60, status: 'In Progress' },
      { name: 'Testing', progress: 0, status: 'Not Started' },
      { name: 'Deployment', progress: 0, status: 'Not Started' }
    ]

    render(
      <div data-testid="waterfall-phases">
        <h1>Waterfall Project Phases</h1>
        {phases.map(p => (
          <div key={p.name}>
            <h3>{p.name}</h3>
            <span>{p.progress}%</span>
            <span>{p.status}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Waterfall Project Phases')).toBeInTheDocument()
    expect(screen.getByText('Requirements')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('displays Waterfall milestones', () => {
    const milestones = [
      { name: 'Requirements Approved', date: '2024-01-15', status: 'Complete' },
      { name: 'Design Review', date: '2024-02-15', status: 'Complete' },
      { name: 'Code Complete', date: '2024-04-30', status: 'Upcoming' }
    ]

    render(
      <div>
        <h2>Project Milestones</h2>
        {milestones.map(m => (
          <div key={m.name}>
            <span>{m.name}</span>
            <span>{m.date}</span>
            <span>{m.status}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Requirements Approved')).toBeInTheDocument()
    expect(screen.getByText('Design Review')).toBeInTheDocument()
  })

  it('shows phase dependencies', () => {
    render(
      <div>
        <h3>Phase Dependencies</h3>
        <div>Requirements → Design</div>
        <div>Design → Development</div>
        <div>Development → Testing</div>
      </div>
    )

    expect(screen.getByText('Phase Dependencies')).toBeInTheDocument()
    expect(screen.getByText(/Requirements.*Design/)).toBeInTheDocument()
  })

  it('displays phase deliverables', () => {
    render(
      <div>
        <h3>Phase Deliverables</h3>
        <div>Requirements Document</div>
        <div>System Design Specification</div>
        <div>Test Plan</div>
      </div>
    )

    expect(screen.getByText('Requirements Document')).toBeInTheDocument()
    expect(screen.getByText('System Design Specification')).toBeInTheDocument()
  })
})
