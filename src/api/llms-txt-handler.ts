/**
 * LLMs.txt API Route Handler
 * Creates an API route handler for serving /llms.txt
 */

import { NextRequest, NextResponse } from 'next/server';
import type { LLMsTxtConfig, LLMsTxtItem } from '../types';
import { generateLLMsTxt } from '../server/generate-llms-txt';

export interface LLMsTxtHandlerOptions {
  /** Function to get site configuration */
  getSiteConfig: () => Promise<{
    siteName: string;
    siteDescription?: string;
    siteUrl: string;
  }>;
  /** Function to get all content items */
  getContent: () => Promise<LLMsTxtItem[]>;
  /** Cache control header (default: 1 hour) */
  cacheControl?: string;
  /** Custom header text */
  headerText?: string;
  /** Custom footer text */
  footerText?: string;
}

/**
 * Create an API route handler for /llms.txt
 *
 * @example
 * ```ts
 * // app/llms.txt/route.ts
 * import { createLLMsTxtHandler } from 'next-llm-ready/api';
 *
 * export const GET = createLLMsTxtHandler({
 *   getSiteConfig: async () => ({
 *     siteName: 'My Site',
 *     siteDescription: 'A great website',
 *     siteUrl: 'https://example.com',
 *   }),
 *   getContent: async () => {
 *     const posts = await getAllPosts();
 *     return posts.map(post => ({
 *       title: post.title,
 *       url: `https://example.com/blog/${post.slug}`,
 *       type: 'post',
 *       date: post.date,
 *     }));
 *   },
 * });
 * ```
 */
export function createLLMsTxtHandler(options: LLMsTxtHandlerOptions) {
  return async function handler(request: NextRequest): Promise<NextResponse> {
    try {
      const siteConfig = await options.getSiteConfig();
      const content = await options.getContent();

      const config: LLMsTxtConfig = {
        siteName: siteConfig.siteName,
        siteDescription: siteConfig.siteDescription,
        siteUrl: siteConfig.siteUrl,
        content,
        headerText: options.headerText,
        footerText: options.footerText,
      };

      const llmsTxt = generateLLMsTxt(config);

      return new NextResponse(llmsTxt, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': options.cacheControl || 'public, max-age=3600',
          'X-Robots-Tag': 'noindex',
        },
      });
    } catch (error) {
      console.error('Error generating llms.txt:', error);
      return new NextResponse('Error generating llms.txt', { status: 500 });
    }
  };
}

/**
 * Create a Pages Router API handler for /api/llms.txt
 *
 * @example
 * ```ts
 * // pages/api/llms.txt.ts
 * import { createLLMsTxtPageHandler } from 'next-llm-ready/api';
 *
 * export default createLLMsTxtPageHandler({
 *   getSiteConfig: async () => ({ ... }),
 *   getContent: async () => { ... },
 * });
 * ```
 */
export function createLLMsTxtPageHandler(options: LLMsTxtHandlerOptions) {
  return async function handler(
    req: { method?: string },
    res: {
      status: (code: number) => { end: (body?: string) => void; json: (body: unknown) => void };
      setHeader: (name: string, value: string) => void;
    }
  ): Promise<void> {
    if (req.method !== 'GET') {
      res.status(405).end('Method Not Allowed');
      return;
    }

    try {
      const siteConfig = await options.getSiteConfig();
      const content = await options.getContent();

      const config: LLMsTxtConfig = {
        siteName: siteConfig.siteName,
        siteDescription: siteConfig.siteDescription,
        siteUrl: siteConfig.siteUrl,
        content,
        headerText: options.headerText,
        footerText: options.footerText,
      };

      const llmsTxt = generateLLMsTxt(config);

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', options.cacheControl || 'public, max-age=3600');
      res.setHeader('X-Robots-Tag', 'noindex');
      res.status(200).end(llmsTxt);
    } catch (error) {
      console.error('Error generating llms.txt:', error);
      res.status(500).end('Error generating llms.txt');
    }
  };
}
