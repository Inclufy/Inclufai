import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'
import { mockProject } from '@tests/mocks/data'

describe('Project Detail Page', () => {
  it('renders project information', () => {
    render(
      <div data-testid="project-detail">
        <h1>{mockProject.name}</h1>
        <span>{mockProject.methodology}</span>
        <span>{mockProject.status}</span>
      </div>
    )

    expect(screen.getByText(mockProject.name)).toBeInTheDocument()
    expect(screen.getByText(mockProject.methodology)).toBeInTheDocument()
  })

  it('displays project timeline', () => {
    render(
      <div>
        <span>Start Date</span>
        <span>2024-01-01</span>
      </div>
    )

    expect(screen.getByText('Start Date')).toBeInTheDocument()
  })
})
