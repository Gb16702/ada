import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDefined();
  });

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole('button', { name: /outline/i });
    expect(button).toBeDefined();
    expect(button.className).toContain('border');
  });

  it('renders disabled state', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDefined();
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button', { name: /custom/i });
    expect(button.className).toContain('custom-class');
  });
});
