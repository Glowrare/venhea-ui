import { StrictMode, useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, Input, Modal } from '../src/index';

function Example() {
  const [open, setOpen] = useState(false);
  return <>
    <Button onClick={() => setOpen(true)}>Edit workspace</Button>
    <Modal open={open} onClose={() => setOpen(false)} title="Edit workspace" description="Changes apply to the demo only.">
      <Input label="Workspace name" />
      <Button onClick={() => setOpen(false)}>Save changes</Button>
      <button disabled>Unavailable</button>
      <button hidden>Hidden</button>
    </Modal>
  </>;
}

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(<Modal open={false} onClose={vi.fn()} title="Closed">Content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('provides a named, described dialog in a portal and initially focuses its close button', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Edit workspace' }));
    const dialog = screen.getByRole('dialog', { name: 'Edit workspace' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Changes apply to the demo only.');
    expect(container).not.toContainElement(dialog);
    expect(within(dialog).getByRole('button', { name: 'Close dialog' })).toHaveFocus();
    expect(container).toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('traps Tab in both directions, skips unavailable controls, and prevents focus escape', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const opener = screen.getByRole('button', { name: 'Edit workspace' });
    await user.click(opener);
    const close = screen.getByRole('button', { name: 'Close dialog' });
    const save = screen.getByRole('button', { name: 'Save changes' });
    await user.tab({ shift: true });
    expect(save).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText('Workspace name')).toHaveFocus();
    await user.tab();
    expect(save).toHaveFocus();
    opener.focus();
    expect(close).toHaveFocus();
  });

  it('dismisses with Escape and restores focus, background access, and scroll state', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    const opener = screen.getByRole('button', { name: 'Edit workspace' });
    await user.click(opener);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(container).not.toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('');
  });

  it('dismisses through its close button', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Edit workspace' }));
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dismisses only when the backdrop itself is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Sample">Dialog content</Modal>);
    const dialog = screen.getByRole('dialog');
    await user.click(screen.getByText('Dialog content'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(dialog.parentElement!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('uses the latest callback without resetting focus on rerender', async () => {
    const user = userEvent.setup();
    const original = vi.fn();
    const latest = vi.fn();
    const view = (onClose: () => void) => <Modal open onClose={onClose} title="Sample"><Input label="Draft" /></Modal>;
    const { rerender } = render(view(original));
    const input = screen.getByLabelText('Draft');
    await user.click(input);
    rerender(view(latest));
    expect(input).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(latest).toHaveBeenCalledOnce();
    expect(original).not.toHaveBeenCalled();
  });

  it('cleans up on unmount and preserves existing inert and overflow values in StrictMode', () => {
    const background = document.createElement('aside');
    background.setAttribute('inert', 'inert');
    document.body.append(background);
    document.body.style.overflow = 'scroll';
    const onClose = vi.fn();
    const { container, unmount } = render(<StrictMode><Modal open onClose={onClose} title="Sample">Content</Modal></StrictMode>);
    unmount();
    expect(background).toHaveAttribute('inert', 'inert');
    expect(container).not.toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('scroll');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
    background.remove();
    document.body.style.overflow = '';
  });

  it('makes new background elements inert and restores them on close', async () => {
    const { unmount } = render(<Modal open onClose={vi.fn()} title="Sample">Content</Modal>);
    const background = document.createElement('aside');
    document.body.append(background);
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(background).toHaveAttribute('inert');
    unmount();
    expect(background).not.toHaveAttribute('inert');
    background.remove();
  });
});
