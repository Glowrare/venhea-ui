import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../src/index';

describe('Input', () => {
  it('associates its label and description and forwards native interaction', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} label="Project name" description="Use a synthetic name." name="project" onChange={onChange} required />);
    const input = screen.getByRole('textbox', { name: 'Project name' });
    expect(input).toHaveAccessibleDescription('Use a synthetic name.');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('name', 'project');
    expect(ref.current).toBe(input);
    await user.click(screen.getByText('Project name'));
    expect(input).toHaveFocus();
    await user.type(input, 'Aurora');
    expect(input).toHaveValue('Aurora');
    expect(onChange).toHaveBeenCalledTimes(6);
  });

  it('merges external help, description, and error associations and clears stale errors', () => {
    const view = (error?: string) => <>
      <p id="external-help">Required for this demo.</p>
      <Input id="project" label="Project" description="Letters only." aria-describedby="external-help" {...(error ? { error } : {})} />
    </>;
    const { rerender } = render(view('Please enter a project.'));
    const input = screen.getByLabelText('Project');
    expect(input).toHaveAttribute('id', 'project');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'external-help project-description project-error');
    expect(input).toHaveAccessibleDescription('Required for this demo. Letters only. Please enter a project.');
    rerender(view());
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAttribute('aria-describedby', 'external-help project-description');
    expect(screen.queryByText('Please enter a project.')).not.toBeInTheDocument();
  });

  it('generates unique stable IDs for repeated fields', () => {
    const { rerender } = render(<><Input label="First" /><Input label="Second" /></>);
    const firstId = screen.getByLabelText('First').id;
    expect(firstId).not.toBe(screen.getByLabelText('Second').id);
    rerender(<><Input label="First" description="Updated" /><Input label="Second" /></>);
    expect(screen.getByLabelText('First')).toHaveAttribute('id', firstId);
  });

  it('honors disabled and externally supplied invalid states', async () => {
    const user = userEvent.setup();
    render(<Input label="Project" disabled aria-invalid="true" />);
    const input = screen.getByLabelText('Project');
    await user.type(input, 'Ignored');
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).not.toHaveAttribute('aria-describedby');
  });
});
