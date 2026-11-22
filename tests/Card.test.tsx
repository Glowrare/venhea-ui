import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, Card, CardBody, CardFooter, CardHeader } from '../src/index';

describe('Card', () => {
  it('composes semantic content and interactive controls without extra landmarks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} className="custom" aria-labelledby="card-title">
        <CardHeader><h2 id="card-title">Sample workspace</h2></CardHeader>
        <CardBody><p>A synthetic workspace for component examples.</p></CardBody>
        <CardFooter><Button onClick={onClick}>Open workspace</Button></CardFooter>
      </Card>,
    );
    expect(ref.current).toHaveClass('venhea-card', 'custom');
    expect(ref.current).not.toHaveAttribute('role');
    expect(within(ref.current!).getByRole('heading', { name: 'Sample workspace' })).toBeInTheDocument();
    expect(screen.getByText('A synthetic workspace for component examples.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open workspace' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
