'use client';

/**
 * CopyDropdown Component
 * Split button with dropdown menu for copy/view/download
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CopyDropdownProps, DropdownMenuItem, CopyAction } from '../types';
import { useLLMCopy } from '../hooks/use-llm-copy';

const defaultMenuItems: DropdownMenuItem[] = [
  {
    id: 'copy',
    label: 'Copy to clipboard',
    action: 'copy',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    shortcut: '⌘+Shift+C',
  },
  {
    id: 'view',
    label: 'View markdown',
    action: 'view',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'download',
    label: 'Download .md file',
    action: 'download',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
];

/**
 * Split button with dropdown for copy/view/download actions
 *
 * @example
 * ```tsx
 * <CopyDropdown
 *   content={{
 *     title: "My Article",
 *     content: "<p>Article content...</p>",
 *     url: "https://example.com/article",
 *   }}
 *   text="Copy for AI"
 * />
 * ```
 */
export function CopyDropdown({
  content,
  text = 'Copy',
  menuItems = defaultMenuItems,
  position = 'inline',
  keyboardShortcut = true,
  className = '',
  toastMessage = 'Copied!',
  toastDuration = 2000,
  onCopy,
  onError,
  onAnalytics,
  style,
  disabled = false,
}: CopyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { copy, view, download, markdown, isCopying, isSuccess } = useLLMCopy({
    content,
    onSuccess: (action: CopyAction) => {
      if (action === 'copy') {
        setShowToast(true);
        setTimeout(() => setShowToast(false), toastDuration);
      }
      onCopy?.(action);
    },
    onError,
    onAnalytics,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    if (!keyboardShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close dropdown on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        return;
      }

      // Ctrl/Cmd + Shift + C
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copy();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcut, copy, isOpen]);

  // Handle menu item click
  const handleItemClick = useCallback(
    (item: DropdownMenuItem) => {
      setIsOpen(false);

      if (typeof item.action === 'function') {
        item.action();
        return;
      }

      switch (item.action) {
        case 'copy':
          copy();
          break;
        case 'view':
          view();
          setShowModal(true);
          break;
        case 'download':
          download();
          break;
      }
    },
    [copy, view, download]
  );

  // Keyboard navigation in dropdown
  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      const items = dropdownRef.current?.querySelectorAll('button');
      if (!items) return;

      const currentIndex = Array.from(items).indexOf(document.activeElement as HTMLButtonElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[nextIndex]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[prevIndex]?.focus();
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [isOpen]
  );

  const containerClasses = [
    'llm-ready-container',
    `llm-ready-position-${position}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div ref={containerRef} className={containerClasses} style={style}>
        <div className="llm-ready-btn-group">
          {/* Main copy button */}
          <button
            type="button"
            className={`llm-ready-copy-btn ${isCopying ? 'llm-ready-copying' : ''} ${isSuccess ? 'llm-ready-success' : ''}`}
            onClick={copy}
            disabled={disabled || isCopying}
            aria-label={text}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="llm-ready-icon"
            >
              {isSuccess ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </>
              )}
            </svg>
            <span className="llm-ready-btn-text">{isSuccess ? toastMessage : text}</span>
          </button>

          {/* Dropdown toggle */}
          <button
            type="button"
            className="llm-ready-dropdown-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label="More options"
            disabled={disabled}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Dropdown menu */}
        <div
          ref={dropdownRef}
          className={`llm-ready-dropdown ${isOpen ? 'llm-ready-dropdown--open' : ''}`}
          role="menu"
          aria-hidden={!isOpen}
          onKeyDown={handleDropdownKeyDown}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="llm-ready-dropdown-item"
              role="menuitem"
              onClick={() => handleItemClick(item)}
              tabIndex={isOpen ? 0 : -1}
            >
              {item.icon && <span className="llm-ready-dropdown-icon">{item.icon}</span>}
              <span className="llm-ready-dropdown-label">{item.label}</span>
              {item.shortcut && (
                <span className="llm-ready-dropdown-shortcut">{item.shortcut}</span>
              )}
            </button>
          ))}
        </div>

        {/* Toast */}
        {showToast && (
          <div className="llm-ready-toast llm-ready-toast--visible" role="status">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Markdown viewer modal */}
      {showModal && (
        <MarkdownModal
          content={markdown}
          onClose={() => setShowModal(false)}
          onCopy={copy}
          onDownload={download}
        />
      )}
    </>
  );
}

/**
 * Simple markdown viewer modal
 */
function MarkdownModal({
  content,
  onClose,
  onCopy,
  onDownload,
}: {
  content: string;
  onClose: () => void;
  onCopy: () => Promise<boolean>;
  onDownload: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Trap focus
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, []);

  return (
    <div className="llm-ready-modal" role="dialog" aria-modal="true" aria-label="Markdown content">
      <div className="llm-ready-modal-backdrop" onClick={onClose} />
      <div ref={modalRef} className="llm-ready-modal-content">
        <div className="llm-ready-modal-header">
          <h2 className="llm-ready-modal-title">Markdown Content</h2>
          <button
            type="button"
            className="llm-ready-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="llm-ready-modal-body">
          <pre className="llm-ready-markdown-content">{content}</pre>
        </div>
        <div className="llm-ready-modal-footer">
          <button type="button" className="llm-ready-btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="llm-ready-btn-secondary" onClick={onDownload}>
            Download
          </button>
          <button type="button" className="llm-ready-btn-primary" onClick={onCopy}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default CopyDropdown;
