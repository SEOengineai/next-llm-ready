/**
 * API Route Handlers Export
 * For use in Next.js API routes
 */

export {
  createLLMsTxtHandler,
  createLLMsTxtPageHandler,
  type LLMsTxtHandlerOptions,
} from './llms-txt-handler';

export {
  createMarkdownHandler,
  withLLMParam,
  hasLLMParam,
} from './markdown-handler';

export {
  createAnalyticsHandler,
  createAnalyticsPageHandler,
  createInMemoryStorage,
  aggregateEvents,
  getEventsForContent,
} from './analytics-handler';

// Re-export types
export type {
  MarkdownHandlerOptions,
  AnalyticsHandlerOptions,
  AnalyticsStorageAdapter,
  AnalyticsEvent,
} from '../types';
