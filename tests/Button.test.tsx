import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../src/index';

describe('Button', () => {
  it('supports keyboard activation and forwards native props and refs', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} onClick={onClick} name="action" className="custom">Save draft</Button>);
    const button = screen.getByRole('button', { name: 'Save draft' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('aurora-button--primary', 'aurora-button--md', 'custom');
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('name', 'action');
    await user.tab();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it.each(['disabled', 'loading'] as const)('prevents activation when %s', async (state) => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button {...{ [state]: true }} onClick={onClick}>Save draft</Button>);
    const button = screen.getByRole('button', { name: 'Save draft' });
    expect(button).toBeDisabled();
    await user.click(button);
    await user.tab();
    expect(button).not.toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
    if (state === 'loading') expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('resumes interaction after loading and supports explicit submit buttons', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const { rerender } = render(<form onSubmit={onSubmit}><Button loading>Save</Button></form>);
    rerender(<form onSubmit={onSubmit}><Button type="submit" variant="secondary" size="lg">Save</Button></form>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).not.toHaveAttribute('aria-busy');
    expect(button).toHaveClass('aurora-button--secondary', 'aurora-button--lg');
    await user.click(button);
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
