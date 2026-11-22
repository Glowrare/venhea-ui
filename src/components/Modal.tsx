import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { classes } from './classes.js';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

function focusableElements(dialog: HTMLElement): HTMLElement[] {
  const candidates = dialog.querySelectorAll<HTMLElement>(
    'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]',
  );
  return Array.from(candidates).filter((element) => {
    if (element.tabIndex < 0 || element.matches(':disabled, input[type="hidden"]')) return false;
    if (element.closest('[hidden], [inert]')) return false;
    for (let current: HTMLElement | null = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
      if (current === dialog) break;
    }
    return true;
  }).sort((first, second) => {
    const firstOrder = first.tabIndex > 0 ? first.tabIndex : Number.MAX_SAFE_INTEGER;
    const secondOrder = second.tabIndex > 0 ? second.tabIndex : Number.MAX_SAFE_INTEGER;
    return firstOrder - secondOrder;
  });
}

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const layerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useLayoutEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const layer = layerRef.current;
    const dialog = dialogRef.current;
    if (!open || !layer || !dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const inertElements = new Map<Element, string | null>();
    const makeBackgroundInert = () => {
      for (const sibling of Array.from(document.body.children)) {
        if (sibling !== layer && !inertElements.has(sibling)) {
          inertElements.set(sibling, sibling.getAttribute('inert'));
          sibling.setAttribute('inert', '');
        }
      }
    };
    makeBackgroundInert();
    const observer = new MutationObserver(makeBackgroundInert);
    observer.observe(document.body, { childList: true });
    document.body.style.overflow = 'hidden';

    const focusFirst = () => (focusableElements(dialog)[0] ?? dialog).focus();
    const handleFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialog.contains(event.target)) focusFirst();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
      } else if (event.key === 'Tab') {
        const elements = focusableElements(dialog);
        const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
        const nextIndex = event.shiftKey
          ? (currentIndex <= 0 ? elements.length - 1 : currentIndex - 1)
          : (currentIndex + 1) % elements.length;
        event.preventDefault();
        (elements[nextIndex] ?? dialog).focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);
    focusFirst();
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
      for (const [element, previous] of inertElements) {
        if (previous === null) element.removeAttribute('inert');
        else element.setAttribute('inert', previous);
      }
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={layerRef}
      className="venhea-modal-layer"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={classes('venhea-modal', className)}
      >
        <div className="venhea-modal-header">
          <h2 id={titleId} className="venhea-modal-title">{title}</h2>
          <button type="button" className="venhea-modal-close" aria-label="Close dialog" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {description && <p id={descriptionId} className="venhea-modal-description">{description}</p>}
        <div className="venhea-modal-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
