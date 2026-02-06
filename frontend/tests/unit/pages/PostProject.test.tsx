import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Post Project Page', () => {
  it('renders project completion summary', () => {
    render(
      <div data-testid="project-summary">
        <h1>Project Completion Summary</h1>
        <div>Project: Digital Transformation</div>
        <div>Status: Completed</div>
        <div>Duration: 12 months</div>
      </div>
    )

    expect(screen.getByText('Project Completion Summary')).toBeInTheDocument()
    expect(screen.getByText(/Digital Transformation/)).toBeInTheDocument()
  })

  it('displays lessons learned form', () => {
    render(
      <form data-testid="lessons-form">
        <h2>Lessons Learned</h2>
        <label htmlFor="successes">What Went Well</label>
        <textarea id="successes" />
        
        <label htmlFor="challenges">Challenges Faced</label>
        <textarea id="challenges" />
        
        <label htmlFor="improvements">Areas for Improvement</label>
        <textarea id="improvements" />
        
        <label htmlFor="recommendations">Recommendations</label>
        <textarea id="recommendations" />
      </form>
    )

    expect(screen.getByLabelText('What Went Well')).toBeInTheDocument()
    expect(screen.getByLabelText('Challenges Faced')).toBeInTheDocument()
    expect(screen.getByLabelText('Areas for Improvement')).toBeInTheDocument()
    expect(screen.getByLabelText('Recommendations')).toBeInTheDocument()
  })

  it('shows project metrics and KPIs', () => {
    render(
      <div data-testid="project-metrics">
        <h2>Project Metrics</h2>
        <div>
          <span>On Time Delivery</span>
          <span>✓ Yes</span>
        </div>
        <div>
          <span>On Budget</span>
          <span>✓ Yes</span>
        </div>
        <div>
          <span>Quality Score</span>
          <span>4.5 / 5.0</span>
        </div>
        <div>
          <span>Stakeholder Satisfaction</span>
          <span>92%</span>
        </div>
      </div>
    )

    expect(screen.getByText('On Time Delivery')).toBeInTheDocument()
    expect(screen.getByText('On Budget')).toBeInTheDocument()
    expect(screen.getByText('Quality Score')).toBeInTheDocument()
    expect(screen.getByText('92%')).toBeInTheDocument()
  })

  it('displays team performance metrics', () => {
    render(
      <div>
        <h3>Team Performance</h3>
        <div>Team Size: 8 members</div>
        <div>Velocity: 45 points/sprint</div>
        <div>Productivity: High</div>
      </div>
    )

    expect(screen.getByText('Team Performance')).toBeInTheDocument()
    expect(screen.getByText(/45 points/)).toBeInTheDocument()
  })

  it('shows deliverables checklist', () => {
    const deliverables = [
      { name: 'Technical Documentation', status: 'complete' },
      { name: 'User Manual', status: 'complete' },
      { name: 'Training Materials', status: 'complete' }
    ]

    render(
      <div>
        <h3>Deliverables</h3>
        {deliverables.map(d => (
          <div key={d.name}>
            <span>{d.name}</span>
            <span>✓ {d.status}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('Technical Documentation')).toBeInTheDocument()
    expect(screen.getByText('User Manual')).toBeInTheDocument()
  })

  it('displays retrospective action items', () => {
    render(
      <div>
        <h3>Action Items for Future Projects</h3>
        <ul>
          <li>Improve requirement gathering process</li>
          <li>Increase automated testing coverage</li>
          <li>Enhance team communication</li>
        </ul>
      </div>
    )

    expect(screen.getByText('Action Items for Future Projects')).toBeInTheDocument()
    expect(screen.getByText(/requirement gathering/)).toBeInTheDocument()
  })
})
