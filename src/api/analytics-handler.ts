/**
 * Analytics API Route Handler
 * Tracks copy/view/download events
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsEvent, AnalyticsHandlerOptions, AnalyticsStorageAdapter } from '../types';

/**
 * In-memory analytics storage (for development/testing)
 */
export function createInMemoryStorage(): AnalyticsStorageAdapter {
  const events: AnalyticsEvent[] = [];

  return {
    save: async (event: AnalyticsEvent) => {
      events.push(event);
    },
    getAll: async () => [...events],
    clear: async () => {
      events.length = 0;
    },
  };
}

/**
 * Create an API route handler for analytics tracking
 *
 * @example
 * ```ts
 * // app/api/analytics/route.ts
 * import { createAnalyticsHandler, createInMemoryStorage } from 'next-llm-ready/api';
 *
 * const storage = createInMemoryStorage();
 *
 * export const POST = createAnalyticsHandler({
 *   storage,
 *   rateLimit: 100,
 * });
 *
 * export const GET = async () => {
 *   const events = await storage.getAll();
 *   return NextResponse.json({ events });
 * };
 * ```
 */
export function createAnalyticsHandler(options: AnalyticsHandlerOptions) {
  // Simple rate limiting state
  const requestCounts = new Map<string, { count: number; resetAt: number }>();

  return async function handler(request: NextRequest): Promise<NextResponse> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }

    // Rate limiting
    if (options.rateLimit) {
      const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
      const now = Date.now();
      const windowMs = 60000; // 1 minute window

      const clientData = requestCounts.get(clientIp) || { count: 0, resetAt: now + windowMs };

      if (now > clientData.resetAt) {
        clientData.count = 0;
        clientData.resetAt = now + windowMs;
      }

      clientData.count++;
      requestCounts.set(clientIp, clientData);

      if (clientData.count > options.rateLimit) {
        return new NextResponse('Rate limit exceeded', {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((clientData.resetAt - now) / 1000).toString(),
          },
        });
      }
    }

    try {
      const body = await request.json();
      const event: AnalyticsEvent = {
        action: body.action || 'copy',
        contentId: body.contentId,
        url: body.url || request.headers.get('referer'),
        timestamp: new Date().toISOString(),
        metadata: body.metadata,
      };

      await options.storage.save(event);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (options.cors) {
        headers['Access-Control-Allow-Origin'] = '*';
      }

      return NextResponse.json({ success: true, event }, { headers });
    } catch (error) {
      console.error('Analytics tracking error:', error);
      return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 });
    }
  };
}

/**
 * Create a Pages Router API handler for analytics
 */
export function createAnalyticsPageHandler(options: AnalyticsHandlerOptions) {
  return async function handler(
    req: {
      method?: string;
      body?: unknown;
      headers?: { [key: string]: string | string[] | undefined };
    },
    res: {
      status: (code: number) => {
        end: (body?: string) => void;
        json: (body: unknown) => void;
      };
      setHeader: (name: string, value: string) => void;
    }
  ): Promise<void> {
    if (req.method !== 'POST') {
      res.status(405).end('Method Not Allowed');
      return;
    }

    try {
      const body = req.body as Record<string, unknown>;
      const event: AnalyticsEvent = {
        action: (body?.action as AnalyticsEvent['action']) || 'copy',
        contentId: body?.contentId as string,
        url: (body?.url as string) || (req.headers?.referer as string),
        timestamp: new Date().toISOString(),
        metadata: body?.metadata as Record<string, unknown>,
      };

      await options.storage.save(event);

      if (options.cors) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }

      res.status(200).json({ success: true, event });
    } catch (error) {
      console.error('Analytics tracking error:', error);
      res.status(500).json({ success: false, error: 'Failed to track event' });
    }
  };
}

/**
 * Aggregate analytics events by action type
 */
export async function aggregateEvents(
  storage: AnalyticsStorageAdapter
): Promise<Record<string, number>> {
  const events = await storage.getAll();
  const counts: Record<string, number> = {
    copy: 0,
    view: 0,
    download: 0,
  };

  for (const event of events) {
    if (event.action in counts) {
      counts[event.action]++;
    }
  }

  return counts;
}

/**
 * Get events for a specific content ID
 */
export async function getEventsForContent(
  storage: AnalyticsStorageAdapter,
  contentId: string
): Promise<AnalyticsEvent[]> {
  const events = await storage.getAll();
  return events.filter((event) => event.contentId === contentId);
}
