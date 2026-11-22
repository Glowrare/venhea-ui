import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../src/index';

describe('Badge', () => {
  it.each(['neutral', 'info', 'success', 'warning', 'danger'] as const)('renders readable %s content', (variant) => {
    render(<Badge variant={variant} className="custom" title="Synthetic status">Draft status</Badge>);
    const badge = screen.getByText('Draft status');
    expect(badge).toHaveClass(`venhea-badge--${variant}`, 'custom');
    expect(badge).toHaveAttribute('title', 'Synthetic status');
    expect(badge).not.toHaveAttribute('role');
  });

  it('defaults to neutral', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft')).toHaveClass('venhea-badge--neutral');
  });
});
