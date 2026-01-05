'use client';

/**
 * useLLMCopy Hook
 * Headless hook for copy/view/download functionality
 */

import { useState, useCallback, useMemo } from 'react';
import type { LLMContent, UseLLMCopyOptions, UseLLMCopyReturn, CopyAction } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { downloadAsFile, generateFilename } from '../utils/download';
import { htmlToMarkdown, countWords, calculateReadingTime } from '../utils/html-to-markdown';

/**
 * Generate markdown from LLMContent or string
 */
function generateMarkdownFromContent(content: LLMContent | string): string {
  if (typeof content === 'string') {
    return content;
  }

  const parts: string[] = [];

  // Prompt prefix
  if (content.promptPrefix?.trim()) {
    parts.push(content.promptPrefix.trim());
    parts.push('');
  }

  // Title
  parts.push(`# ${content.title}`);
  parts.push('');

  // Excerpt
  if (content.excerpt) {
    parts.push(`> ${content.excerpt}`);
    parts.push('');
  }

  // Metadata
  parts.push('---');
  parts.push(`- **Source**: ${content.url}`);

  if (content.date) {
    parts.push(`- **Date**: ${content.date}`);
  }

  if (content.author) {
    parts.push(`- **Author**: ${content.author}`);
  }

  if (content.categories?.length) {
    parts.push(`- **Categories**: ${content.categories.join(', ')}`);
  }

  if (content.tags?.length) {
    parts.push(`- **Tags**: ${content.tags.join(', ')}`);
  }

  parts.push('---');
  parts.push('');

  // Content
  if (content.content) {
    const contentMarkdown =
      content.content.includes('<') && content.content.includes('>')
        ? htmlToMarkdown(content.content)
        : content.content;
    parts.push(contentMarkdown);
  }

  return parts.join('\n').trim();
}

/**
 * Hook for LLM copy/view/download operations
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { copy, view, download, markdown, isCopying, isSuccess } = useLLMCopy({
 *     content: {
 *       title: 'My Article',
 *       content: '<p>Article content...</p>',
 *       url: 'https://example.com/article',
 *     },
 *     onSuccess: () => console.log('Copied!'),
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={copy} disabled={isCopying}>
 *         {isSuccess ? 'Copied!' : 'Copy'}
 *       </button>
 *       <button onClick={download}>Download</button>
 *       <pre>{view()}</pre>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLLMCopy(options: UseLLMCopyOptions): UseLLMCopyReturn {
  const [isCopying, setIsCopying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Generate markdown once
  const markdown = useMemo(() => {
    return generateMarkdownFromContent(options.content);
  }, [options.content]);

  // Track analytics event
  const trackEvent = useCallback(
    (action: CopyAction) => {
      if (options.onAnalytics) {
        const contentId =
          typeof options.content === 'string' ? undefined : options.content.url;

        options.onAnalytics({
          action,
          contentId,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [options]
  );

  // Copy to clipboard
  const copy = useCallback(async (): Promise<boolean> => {
    setIsCopying(true);
    setError(null);

    try {
      const success = await copyToClipboard(markdown);

      if (success) {
        setIsSuccess(true);
        trackEvent('copy');
        options.onSuccess?.('copy');

        // Reset success state after 2 seconds
        setTimeout(() => setIsSuccess(false), 2000);
        return true;
      } else {
        throw new Error('Failed to copy to clipboard');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Copy failed');
      setError(error);
      options.onError?.(error);
      return false;
    } finally {
      setIsCopying(false);
    }
  }, [markdown, options, trackEvent]);

  // View markdown (returns the string)
  const view = useCallback((): string => {
    trackEvent('view');
    options.onSuccess?.('view');
    return markdown;
  }, [markdown, options, trackEvent]);

  // Download as file
  const download = useCallback(
    (filename?: string): void => {
      const title =
        typeof options.content === 'string' ? 'content' : options.content.title;

      downloadAsFile(markdown, {
        filename: filename || generateFilename(title),
        extension: 'md',
      });

      trackEvent('download');
      options.onSuccess?.('download');
    },
    [markdown, options, trackEvent]
  );

  return {
    copy,
    view,
    download,
    markdown,
    isCopying,
    isSuccess,
    error,
  };
}

/**
 * Get word count and reading time from content
 */
export function useContentStats(content: LLMContent | string) {
  return useMemo(() => {
    const markdown = generateMarkdownFromContent(content);
    const wordCount = countWords(markdown);
    const readingTime = calculateReadingTime(markdown);

    return { wordCount, readingTime };
  }, [content]);
}
