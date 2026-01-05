'use client';

/**
 * CopyButton Component
 * Simple copy button with optional tooltip
 */

import React, { useState, useCallback } from 'react';
import type { CopyButtonProps, CopyAction } from '../types';
import { useLLMCopy } from '../hooks/use-llm-copy';

/**
 * Simple copy button component
 *
 * @example
 * ```tsx
 * <CopyButton
 *   content={{
 *     title: "My Article",
 *     content: "<p>Article content...</p>",
 *     url: "https://example.com/article",
 *   }}
 *   text="Copy for AI"
 * />
 * ```
 */
export function CopyButton({
  content,
  text = 'Copy',
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
}: CopyButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const { copy, isCopying, isSuccess, error } = useLLMCopy({
    content,
    onSuccess: (action: CopyAction) => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), toastDuration);
      onCopy?.(action);
    },
    onError,
    onAnalytics,
  });

  // Handle keyboard shortcut
  React.useEffect(() => {
    if (!keyboardShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copy();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcut, copy]);

  const buttonClasses = [
    'llm-ready-copy-btn',
    `llm-ready-position-${position}`,
    isCopying && 'llm-ready-copying',
    isSuccess && 'llm-ready-success',
    error && 'llm-ready-error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="llm-ready-container" style={style}>
      <button
        type="button"
        className={buttonClasses}
        onClick={copy}
        disabled={disabled || isCopying}
        aria-label={text}
        title={keyboardShortcut ? `${text} (${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+C)` : text}
      >
        {/* Copy icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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

      {/* Toast notification */}
      {showToast && (
        <div className="llm-ready-toast llm-ready-toast--visible" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default CopyButton;
