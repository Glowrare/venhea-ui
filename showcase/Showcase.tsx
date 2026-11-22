import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Input, Modal } from '../src/index';
import { version } from '../package.json';

const components = ['Button', 'Badge', 'Input', 'Card', 'Modal'] as const;

function Section({ id, title, description, children }: {
  id: string; title: string; description: string; children: ReactNode;
}) {
  return (
    <section id={id} className="showcase-section" aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

export function Showcase() {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [projectName, setProjectName] = useState('Design foundations');
  const [email, setEmail] = useState('team@');
  const [workspaceName, setWorkspaceName] = useState('Northstar workspace');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState(workspaceName);
  const [dialogError, setDialogError] = useState('');
  const [workspaceStatus, setWorkspaceStatus] = useState('All changes stay in this browser session.');
  const dialogInput = useRef<HTMLInputElement>(null);
  const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? '' : 'Enter an email such as team@example.test.';

  useEffect(() => {
    if (saveState !== 'saving') return;
    const timer = window.setTimeout(() => setSaveState('saved'), 1200);
    return () => window.clearTimeout(timer);
  }, [saveState]);

  function openDialog() {
    setDraftName(workspaceName);
    setDialogError('');
    setDialogOpen(true);
  }

  function saveWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draftName.trim();
    if (name.length < 2) {
      setDialogError('Use at least two characters for the workspace name.');
      dialogInput.current?.focus();
      return;
    }
    setWorkspaceName(name);
    setWorkspaceStatus(`Workspace renamed to ${name}.`);
    setDialogOpen(false);
  }

  return (
    <>
      <a className="showcase-skip" href="#main">Skip to components</a>
      <header className="showcase-header">
        <div className="header-inner">
          <a className="showcase-brand" href="#main" aria-label="Aurora UI Kit home">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
            <span>Aurora <span className="brand-light">UI Kit</span></span>
          </a>
          <div className="header-meta"><span>Local component showcase</span><code>v{version}</code></div>
        </div>
      </header>

      <div className="showcase-layout">
        <aside className="showcase-sidebar">
          <nav aria-label="Components">
            <p className="eyebrow nav-label">Explore the kit</p>
            <div className="component-links">
              {components.map((name) => <a key={name} href={`#${name.toLowerCase()}`}>{name}</a>)}
            </div>
          </nav>
          <div className="sidebar-note">
            <span className="sidebar-note-icon" aria-hidden="true">⌘</span>
            <p>Made for the keyboard.</p>
            <span>Use Tab to explore focus states and interact with each example.</span>
          </div>
        </aside>

        <main id="main" className="showcase-main" tabIndex={-1}>
          <div className="showcase-intro">
            <p className="eyebrow">The component collection</p>
            <h1>Made to work<br />together.</h1>
            <p className="intro-copy">Five thoughtful building blocks for everyday interfaces.
              Explore the variants, try the interactions, and find your starting point.</p>
            <div className="intro-tags"><span>React 19</span><span>TypeScript</span><span>Accessible defaults</span></div>
          </div>

          <div className="foundation-strip" aria-label="Shared design tokens">
            <div><span className="token-swatch token-primary" /><span>Ocean teal<small>Primary action</small></span></div>
            <div><span className="token-swatch token-text" /><span>Deep slate<small>Text & contrast</small></span></div>
            <div><span className="token-swatch token-surface" /><span>Soft surfaces<small>Room to breathe</small></span></div>
          </div>

          <Section id="button" title="Button" description="A clear next step, at every size and state.">
            <div className="example-panel">
              <div className="variant-grid">
                <div><Button>Save changes</Button><span className="example-label">Primary</span></div>
                <div><Button variant="secondary">View details</Button><span className="example-label">Secondary</span></div>
                <div><Button variant="danger">Delete draft</Button><span className="example-label">Danger</span></div>
              </div>
              <div className="example-divider" />
              <div className="example-row size-examples">
                <Button size="sm" variant="secondary">Small</Button>
                <Button size="md" variant="secondary">Medium</Button>
                <Button size="lg" variant="secondary">Large</Button>
                <span className="example-note">Same details. Different scales.</span>
              </div>
              <div className="example-divider" />
              <div className="example-row">
                <Button loading={saveState === 'saving'} onClick={() => setSaveState('saving')}>
                  {saveState === 'saving' ? 'Saving changes' : saveState === 'saved' ? 'Save again' : 'Try saving'}
                </Button>
                <Button disabled>Unavailable</Button>
                <Button loading variant="secondary">Loading preview</Button>
              </div>
              <p className="interaction-status" role="status">
                {saveState === 'saved' ? 'Changes saved. You can try it again.'
                  : saveState === 'saving' ? 'Saving your example changes…' : 'Try saving to see the loading state in action.'}
              </p>
            </div>
            <pre className="example-code"><code>{'<Button variant="primary" size="md">Save changes</Button>'}</code></pre>
          </Section>

          <Section id="badge" title="Badge" description="Small signals that give status a little more context.">
            <div className="example-panel badge-examples">
              {([
                ['neutral', 'Draft'], ['info', 'In review'], ['success', 'Ready'],
                ['warning', 'Needs attention'], ['danger', 'Failed'],
              ] as const).map(([variant, label]) => (
                <div key={variant}><Badge variant={variant}>{label}</Badge><span className="example-label">{variant}</span></div>
              ))}
            </div>
            <pre className="example-code"><code>{'<Badge variant="success">Ready</Badge>'}</code></pre>
          </Section>

          <Section id="input" title="Input" description="Helpful labels, useful guidance, and errors you can act on.">
            <div className="example-panel field-grid">
              <Input label="Project name" value={projectName} onChange={(event) => setProjectName(event.target.value)}
                description="A short name that helps your team find it." />
              <Input label="Notification email" type="email" value={email} onChange={(event) => setEmail(event.target.value)}
                description="Try team@example.test to clear the error." error={emailError} />
              <Input label="Workspace ID" defaultValue="aurora-demo" disabled description="Assigned when a workspace is created." />
              <Input label="Reference" value="AK-0042" readOnly description="Read-only, but still selectable and focusable." />
            </div>
            <pre className="example-code"><code>{'<Input label="Project name" description="Give it a clear name." />'}</code></pre>
          </Section>

          <Section id="card" title="Card" description="A flexible frame. Add structure only where you need it.">
            <div className="card-grid">
              <Card className="workspace-card">
                <CardHeader><div className="card-title-row"><h3>{workspaceName}</h3><Badge variant="success">Active</Badge></div></CardHeader>
                <CardBody>
                  <p>A shared home for your next good idea.</p>
                  <dl className="workspace-details"><div><dt>Projects</dt><dd>3 sample projects</dd></div><div><dt>Visibility</dt><dd>Private</dd></div></dl>
                </CardBody>
                <CardFooter>
                  <Button size="sm" onClick={openDialog}>Edit workspace</Button>
                  <Button size="sm" variant="secondary" onClick={() => setWorkspaceStatus('Workspace overview selected. This is a local example.')}>View overview</Button>
                </CardFooter>
              </Card>
              <Card className="simple-card"><CardBody>
                <span className="card-glyph" aria-hidden="true">✦</span>
                <h3>Less can be enough.</h3>
                <p>A card can be as simple as a body and a little breathing room.
                  Headers and footers are entirely up to you.</p>
                <span className="example-label">Card + CardBody</span>
              </CardBody></Card>
            </div>
            <p className="interaction-status" role="status">{workspaceStatus}</p>
            <pre className="example-code"><code>{'<Card><CardHeader>…</CardHeader><CardBody>…</CardBody><CardFooter>…</CardFooter></Card>'}</code></pre>
          </Section>

          <Section id="modal" title="Modal" description="A focused moment, with a clear way back.">
            <div className="modal-example">
              <div className="modal-example-copy">
                <span className="eyebrow">Try the interaction</span>
                <h3>A little space to make a change.</h3>
                <p>Edit the workspace name, save it, and see the card above update.
                  Cancel leaves your workspace as it was.</p>
                <div className="keyboard-hints"><span><kbd>Tab</kbd> move focus</span><span><kbd>Esc</kbd> close dialog</span></div>
              </div>
              <Button onClick={openDialog}>Open dialog</Button>
            </div>
            <pre className="example-code"><code>{'<Modal open={open} onClose={close} title="Edit workspace">…</Modal>'}</code></pre>
          </Section>

          <footer className="showcase-footer"><span>Aurora UI Kit · v{version}</span><span>Small pieces. Shared foundations.</span></footer>
        </main>
      </div>

      <Modal open={dialogOpen} onClose={() => setDialogOpen(false)} title="Edit workspace"
        description="Changes update this local example only.">
        <form onSubmit={saveWorkspace} className="dialog-form">
          <Input ref={dialogInput} label="Workspace name" value={draftName} maxLength={48}
            onChange={(event) => { setDraftName(event.target.value); setDialogError(''); }}
            description="Choose a name between 2 and 48 characters." error={dialogError} />
          <p className="dialog-error-status" role="status">{dialogError}</p>
          <div className="dialog-actions"><Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit">Save workspace</Button></div>
        </form>
      </Modal>
    </>
  );
}
