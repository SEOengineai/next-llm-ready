'use client';

/**
 * useAnalytics Hook
 * Track LLM copy/view/download events
 */

import { useCallback, useRef } from 'react';
import type { AnalyticsEvent, CopyAction, UseAnalyticsOptions, UseAnalyticsReturn } from '../types';

/**
 * Hook for analytics tracking
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { track, trackCopy, trackView, trackDownload } = useAnalytics({
 *     endpoint: '/api/analytics',
 *     metadata: { contentId: 'article-123' },
 *   });
 *
 *   return (
 *     <button onClick={trackCopy}>Copy</button>
 *   );
 * }
 * ```
 */
export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const {
    endpoint = '/api/llm-analytics',
    includeUrl = true,
    includeTimestamp = true,
    metadata = {},
  } = options;

  // Track pending requests to avoid duplicates
  const pendingRef = useRef<Set<string>>(new Set());

  // Generic track function
  const track = useCallback(
    async (event: AnalyticsEvent): Promise<void> => {
      // Create unique key for deduplication
      const key = `${event.action}-${event.contentId || ''}-${Date.now()}`;

      if (pendingRef.current.has(key)) {
        return;
      }

      pendingRef.current.add(key);

      try {
        const payload: AnalyticsEvent = {
          ...event,
          ...(includeUrl && { url: event.url || window.location.href }),
          ...(includeTimestamp && { timestamp: event.timestamp || new Date().toISOString() }),
          metadata: { ...metadata, ...event.metadata },
        };

        // Use sendBeacon for reliability (won't be cancelled on page unload)
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon(endpoint, blob);
        } else {
          // Fallback to fetch
          await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
          });
        }
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      } finally {
        pendingRef.current.delete(key);
      }
    },
    [endpoint, includeUrl, includeTimestamp, metadata]
  );

  // Convenience methods for each action type
  const trackCopy = useCallback(() => {
    return track({ action: 'copy' });
  }, [track]);

  const trackView = useCallback(() => {
    return track({ action: 'view' });
  }, [track]);

  const trackDownload = useCallback(() => {
    return track({ action: 'download' });
  }, [track]);

  return { track, trackCopy, trackView, trackDownload };
}

/**
 * Create a simple analytics tracker function (non-hook version)
 */
export function createAnalyticsTracker(endpoint: string) {
  return async function trackEvent(
    action: CopyAction,
    contentId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const payload: AnalyticsEvent = {
      action,
      contentId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
      metadata,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
      } else if (typeof fetch !== 'undefined') {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };
}
