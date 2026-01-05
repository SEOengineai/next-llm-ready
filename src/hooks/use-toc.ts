'use client';

/**
 * useTOC Hook
 * Headless hook for Table of Contents functionality
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { TOCHeading, HeadingLevel, UseTOCOptions, UseTOCReturn } from '../types';

/**
 * Hook for Table of Contents functionality
 *
 * @example
 * ```tsx
 * function ArticlePage() {
 *   const contentRef = useRef<HTMLDivElement>(null);
 *   const { headings, activeId, scrollTo } = useTOC({
 *     contentRef,
 *     levels: ['h2', 'h3'],
 *   });
 *
 *   return (
 *     <div>
 *       <nav>
 *         {headings.map(h => (
 *           <a
 *             key={h.id}
 *             href={`#${h.id}`}
 *             onClick={(e) => { e.preventDefault(); scrollTo(h.id); }}
 *             className={activeId === h.id ? 'active' : ''}
 *           >
 *             {h.text}
 *           </a>
 *         ))}
 *       </nav>
 *       <div ref={contentRef}>
 *         <h2 id="intro">Introduction</h2>
 *         <p>Content...</p>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTOC(options: UseTOCOptions): UseTOCReturn {
  const {
    contentRef,
    levels = ['h2', 'h3', 'h4'],
    rootMargin = '-100px 0px -80% 0px',
    threshold = 0,
  } = options;

  const [headings, setHeadings] = useState<TOCHeading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Extract headings from content
  useEffect(() => {
    if (!contentRef?.current) return;

    const container = contentRef.current;
    const selector = levels.join(', ');
    const elements = container.querySelectorAll(selector);

    const extracted: TOCHeading[] = [];
    let index = 0;

    elements.forEach((el) => {
      const tagName = el.tagName.toLowerCase() as HeadingLevel;
      const level = parseInt(tagName.charAt(1), 10);
      const text = el.textContent?.trim() || '';

      // Generate or use existing ID
      let id = el.id;
      if (!id) {
        id = generateHeadingId(text, index);
        el.id = id;
      }

      extracted.push({ id, text, level });
      index++;
    });

    setHeadings(extracted);
  }, [contentRef, levels]);

  // Track active heading with Intersection Observer
  useEffect(() => {
    if (!contentRef?.current || headings.length === 0) return;

    const container = contentRef.current;
    const observerOptions = {
      root: null,
      rootMargin,
      threshold,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all headings
    headings.forEach((heading) => {
      const element = container.querySelector(`#${CSS.escape(heading.id)}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [contentRef, headings, rootMargin, threshold]);

  // Scroll to heading
  const scrollTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);

      // Update URL hash without scrolling
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `#${id}`);
      }
    }
  }, []);

  return { headings, activeId, scrollTo };
}

/**
 * Generate URL-friendly heading ID
 */
function generateHeadingId(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);

  return slug || `heading-${index}`;
}

/**
 * Build nested TOC structure from flat headings
 */
export function buildNestedTOC(headings: TOCHeading[]): TOCHeading[] {
  if (headings.length === 0) return [];

  const result: TOCHeading[] = [];
  const stack: { heading: TOCHeading; level: number }[] = [];

  for (const heading of headings) {
    const item: TOCHeading = { ...heading, children: [] };

    // Pop items from stack until we find parent
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(item);
    } else {
      const parent = stack[stack.length - 1].heading;
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    }

    stack.push({ heading: item, level: heading.level });
  }

  return result;
}

/**
 * Hook for keyboard navigation in TOC
 */
export function useTOCKeyboard(
  headings: TOCHeading[],
  activeId: string | null,
  scrollTo: (id: string) => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (headings.length === 0) return;

      const currentIndex = headings.findIndex((h) => h.id === activeId);

      if (e.key === 'ArrowDown' && e.altKey) {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, headings.length - 1);
        scrollTo(headings[nextIndex].id);
      } else if (e.key === 'ArrowUp' && e.altKey) {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        scrollTo(headings[prevIndex].id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [headings, activeId, scrollTo]);
}
