import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests - Components', () => {
  it('button should be accessible', async () => {
    const Button = () => <button aria-label="Test button">Click me</button>;
    const { container } = render(<Button />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('form should be accessible', async () => {
    const Form = () => (
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </form>
    );
    const { container } = render(<Form />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('navigation should be accessible', async () => {
    const Nav = () => (
      <nav aria-label="Main">
        <a href="/">Home</a>
      </nav>
    );
    const { container } = render(<Nav />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('images should have alt text', async () => {
    const Img = () => <img src="test.jpg" alt="Description" />;
    const { container } = render(<Img />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
