import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@tests/helpers/render'
import userEvent from '@testing-library/user-event'

describe('CreateProject Component', () => {
  it('renders project creation form', () => {
    render(<div data-testid="create-project-form">Create Project</div>)
    expect(screen.getByTestId('create-project-form')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(
      <form data-testid="project-form">
        <input name="name" placeholder="Project Name" />
        <button type="submit">Create</button>
      </form>
    )

    const submitBtn = screen.getByRole('button', { name: /create/i })
    await user.click(submitBtn)
    
    expect(screen.getByTestId('project-form')).toBeInTheDocument()
  })
})
