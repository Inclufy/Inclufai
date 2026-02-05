import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@tests/helpers/render'
import userEvent from '@testing-library/user-event'

// Example Button component test
describe('Button Component', () => {
  it('renders with text', () => {
    render(<button>Click me</button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<button onClick={handleClick}>Click me</button>)
    await user.click(screen.getByText('Click me'))
    
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
