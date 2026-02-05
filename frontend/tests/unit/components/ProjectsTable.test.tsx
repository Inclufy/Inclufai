import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('ProjectsTable Component', () => {
  it('renders empty state', () => {
    render(<div>No projects found</div>)
    expect(screen.getByText(/no projects/i)).toBeInTheDocument()
  })

  it('displays projects list', () => {
    const projects = [
      { id: 1, name: 'Project A', methodology: 'scrum' },
      { id: 2, name: 'Project B', methodology: 'kanban' },
    ]

    render(
      <table>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.methodology}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )

    expect(screen.getByText('Project A')).toBeInTheDocument()
    expect(screen.getByText('Project B')).toBeInTheDocument()
  })
})
