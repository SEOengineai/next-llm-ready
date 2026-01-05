/**
 * Markdown API Route Handler
 * Serves markdown content for ?llm=1 requests
 */

import { NextRequest, NextResponse } from 'next/server';
import type { LLMContent, MarkdownHandlerOptions } from '../types';
import { generateMarkdownString } from '../server/generate-markdown';

/**
 * Create middleware to handle ?llm=1 query parameter
 *
 * @example
 * ```ts
 * // middleware.ts
 * import { withLLMParam } from 'next-llm-ready/api';
 *
 * export default withLLMParam({
 *   getContent: async (pathname) => {
 *     // Extract slug and fetch content
 *     const slug = pathname.split('/').pop();
 *     const post = await getPostBySlug(slug);
 *     if (!post) return null;
 *     return {
 *       title: post.title,
 *       content: post.content,
 *       url: `https://example.com${pathname}`,
 *       date: post.date,
 *     };
 *   },
 * });
 * ```
 */
export function withLLMParam(options: MarkdownHandlerOptions) {
  return async function middleware(request: NextRequest): Promise<NextResponse | undefined> {
    const url = new URL(request.url);
    const llmParam = url.searchParams.get('llm');

    // Only handle if ?llm=1 is present
    if (llmParam !== '1') {
      return undefined; // Continue to next middleware/page
    }

    try {
      const pathname = url.pathname;
      const content = await options.getContent(pathname);

      if (!content) {
        return new NextResponse('Content not found', { status: 404 });
      }

      const markdown = generateMarkdownString(content);

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': options.cacheControl || 'public, max-age=3600',
          'X-Robots-Tag': 'noindex',
          ...(options.cors && {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
          }),
        },
      });
    } catch (error) {
      console.error('Error generating markdown:', error);
      return new NextResponse('Error generating markdown', { status: 500 });
    }
  };
}

/**
 * Create an API route handler for markdown endpoints
 *
 * @example
 * ```ts
 * // app/api/content/[slug]/route.ts
 * import { createMarkdownHandler } from 'next-llm-ready/api';
 *
 * export const GET = createMarkdownHandler({
 *   getContent: async (slug) => {
 *     const post = await getPostBySlug(slug);
 *     if (!post) return null;
 *     return {
 *       title: post.title,
 *       content: post.content,
 *       url: `https://example.com/blog/${slug}`,
 *     };
 *   },
 * });
 * ```
 */
export function createMarkdownHandler(
  options: Omit<MarkdownHandlerOptions, 'getContent'> & {
    getContent: (slug: string) => Promise<LLMContent | null>;
  }
) {
  return async function handler(
    request: NextRequest,
    { params }: { params: { slug?: string } }
  ): Promise<NextResponse> {
    try {
      const slug = params?.slug || '';
      const content = await options.getContent(slug);

      if (!content) {
        return new NextResponse('Content not found', {
          status: 404,
          headers: { 'Content-Type': 'text/plain' },
        });
      }

      const markdown = generateMarkdownString(content);

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': options.cacheControl || 'public, max-age=3600',
          'X-Robots-Tag': 'noindex',
          ...(options.cors && {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
          }),
        },
      });
    } catch (error) {
      console.error('Error generating markdown:', error);
      return new NextResponse('Error generating markdown', { status: 500 });
    }
  };
}

/**
 * Helper to check if request has ?llm=1 parameter
 */
export function hasLLMParam(request: NextRequest): boolean {
  const url = new URL(request.url);
  return url.searchParams.get('llm') === '1';
}
