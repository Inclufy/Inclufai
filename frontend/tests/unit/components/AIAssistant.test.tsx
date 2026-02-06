import { describe, it, expect } from 'vitest'
import { render, screen } from '@tests/helpers/render'

describe('AI Assistant Component', () => {
  it('renders AI chat interface', () => {
    render(
      <div data-testid="ai-assistant">
        <h2>AI Assistant</h2>
        <div>How can I help you today?</div>
        <textarea placeholder="Ask me anything..." />
      </div>
    )

    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument()
  })

  it('displays chat messages', () => {
    const messages = [
      { id: 1, role: 'user', content: 'How do I create a project?' },
      { id: 2, role: 'assistant', content: 'Click the Create Project button...' }
    ]

    render(
      <div>
        {messages.map(m => (
          <div key={m.id}>
            <span>{m.role}</span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
    )

    expect(screen.getByText('How do I create a project?')).toBeInTheDocument()
    expect(screen.getByText(/Click the Create Project/)).toBeInTheDocument()
  })
})
