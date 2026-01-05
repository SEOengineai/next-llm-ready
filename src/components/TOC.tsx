'use client';

/**
 * TOC (Table of Contents) Component
 * Sticky navigation for article headings
 */

import React, { useState, useCallback } from 'react';
import type { TOCProps, TOCHeading } from '../types';
import { useTOC, buildNestedTOC, useTOCKeyboard } from '../hooks/use-toc';

/**
 * Table of Contents component
 *
 * @example
 * ```tsx
 * function Article() {
 *   const contentRef = useRef<HTMLDivElement>(null);
 *
 *   return (
 *     <div className="article-layout">
 *       <TOC
 *         contentRef={contentRef}
 *         position="right"
 *         levels={['h2', 'h3']}
 *         sticky
 *       />
 *       <article ref={contentRef}>
 *         <h2 id="intro">Introduction</h2>
 *         <p>Content...</p>
 *       </article>
 *     </div>
 *   );
 * }
 * ```
 */
export function TOC({
  content,
  contentRef,
  headings: providedHeadings,
  position = 'right',
  levels = ['h2', 'h3', 'h4'],
  title = 'On This Page',
  sticky = true,
  stickyOffset = 80,
  className = '',
  smoothScroll = true,
  highlightActive = true,
  collapsible = true,
  defaultCollapsed = false,
  style,
}: TOCProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Use hook for dynamic headings, or use provided headings
  const { headings: dynamicHeadings, activeId, scrollTo } = useTOC({
    contentRef: contentRef || { current: null },
    levels,
  });

  // Use provided headings if available, otherwise use dynamic
  const headings = providedHeadings || dynamicHeadings;

  // Enable keyboard navigation
  useTOCKeyboard(headings, activeId, scrollTo);

  // Handle click on heading link
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      if (smoothScroll) {
        scrollTo(id);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
          window.history.pushState(null, '', `#${id}`);
        }
      }
    },
    [scrollTo, smoothScroll]
  );

  if (headings.length === 0) {
    return null;
  }

  const tocClasses = [
    'llm-ready-toc',
    `llm-ready-toc-${position}`,
    sticky && 'llm-ready-toc-sticky',
    isCollapsed && 'llm-ready-toc-collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const tocStyle: React.CSSProperties = {
    ...style,
    ...(sticky && { top: stickyOffset }),
  };

  return (
    <nav className={tocClasses} style={tocStyle} aria-label="Table of contents">
      <div className="llm-ready-toc-header">
        <h3 className="llm-ready-toc-title">{title}</h3>
        {collapsible && (
          <button
            type="button"
            className="llm-ready-toc-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expand table of contents' : 'Collapse table of contents'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>

      {!isCollapsed && (
        <ul className="llm-ready-toc-list">
          {headings.map((heading) => (
            <TOCItem
              key={heading.id}
              heading={heading}
              activeId={activeId}
              highlightActive={highlightActive}
              onClick={handleClick}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}

/**
 * Individual TOC item with nested children support
 */
function TOCItem({
  heading,
  activeId,
  highlightActive,
  onClick,
}: {
  heading: TOCHeading;
  activeId: string | null;
  highlightActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const isActive = highlightActive && heading.id === activeId;

  const itemClasses = [
    'llm-ready-toc-item',
    `llm-ready-toc-level-${heading.level}`,
    isActive && 'llm-ready-toc-active',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={itemClasses}>
      <a
        href={`#${heading.id}`}
        className="llm-ready-toc-link"
        onClick={(e) => onClick(e, heading.id)}
        aria-current={isActive ? 'location' : undefined}
      >
        {heading.text}
      </a>
      {heading.children && heading.children.length > 0 && (
        <ul className="llm-ready-toc-nested">
          {heading.children.map((child) => (
            <TOCItem
              key={child.id}
              heading={child}
              activeId={activeId}
              highlightActive={highlightActive}
              onClick={onClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Mobile TOC with slide-up panel
 */
export function TOCMobile(props: TOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        className="llm-ready-toc-mobile-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open table of contents"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span>Contents</span>
      </button>

      {/* Slide-up panel */}
      {isOpen && (
        <div className="llm-ready-toc-mobile-panel">
          <div className="llm-ready-toc-mobile-backdrop" onClick={() => setIsOpen(false)} />
          <div className="llm-ready-toc-mobile-content">
            <div className="llm-ready-toc-mobile-header">
              <h3>Contents</h3>
              <button
                type="button"
                className="llm-ready-toc-mobile-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <TOC {...props} sticky={false} collapsible={false} />
          </div>
        </div>
      )}
    </>
  );
}

export default TOC;
