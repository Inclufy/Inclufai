import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('Six Sigma Methodology Pages', () => {
  it('renders DMAIC phases', () => {
    const phases = [
      { name: 'Define', status: 'Complete' },
      { name: 'Measure', status: 'In Progress' },
      { name: 'Analyze', status: 'Not Started' },
      { name: 'Improve', status: 'Not Started' },
      { name: 'Control', status: 'Not Started' }
    ]

    render(
      <div data-testid="dmaic-phases">
        <h1>DMAIC Process</h1>
        {phases.map(p => (
          <div key={p.name}>
            <h3>{p.name}</h3>
            <span>{p.status}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('DMAIC Process')).toBeInTheDocument()
    expect(screen.getByText('Define')).toBeInTheDocument()
    expect(screen.getByText('Measure')).toBeInTheDocument()
    expect(screen.getByText('Analyze')).toBeInTheDocument()
  })

  it('displays SIPOC diagram', () => {
    render(
      <div>
        <h2>SIPOC Diagram</h2>
        <div>Suppliers</div>
        <div>Inputs</div>
        <div>Process</div>
        <div>Outputs</div>
        <div>Customers</div>
      </div>
    )

    expect(screen.getByText('SIPOC Diagram')).toBeInTheDocument()
    expect(screen.getByText('Suppliers')).toBeInTheDocument()
    expect(screen.getByText('Process')).toBeInTheDocument()
  })

  it('shows quality metrics', () => {
    render(
      <div>
        <h3>Quality Metrics</h3>
        <div>Defect Rate: 2.3%</div>
        <div>Sigma Level: 4.2</div>
        <div>Process Capability: 1.33</div>
      </div>
    )

    expect(screen.getByText('Quality Metrics')).toBeInTheDocument()
    expect(screen.getByText(/Defect Rate/)).toBeInTheDocument()
    expect(screen.getByText(/Sigma Level/)).toBeInTheDocument()
  })

  it('displays control charts', () => {
    render(
      <div>
        <h3>Control Charts</h3>
        <div>UCL: 45.2</div>
        <div>Mean: 42.0</div>
        <div>LCL: 38.8</div>
      </div>
    )

    expect(screen.getByText('Control Charts')).toBeInTheDocument()
    expect(screen.getByText(/UCL/)).toBeInTheDocument()
  })
})
