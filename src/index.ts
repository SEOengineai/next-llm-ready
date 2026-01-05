/**
 * next-llm-ready
 * Make your Next.js content AI-ready with copy buttons, TOC, and llms.txt support
 *
 * @packageDocumentation
 */

// Components
export { CopyButton } from './components/CopyButton';
export { CopyDropdown } from './components/CopyDropdown';
export { TOC, TOCMobile } from './components/TOC';
export { LLMBadge } from './components/LLMBadge';

// Hooks
export { useLLMCopy } from './hooks/use-llm-copy';
export { useTOC, buildNestedTOC, useTOCKeyboard } from './hooks/use-toc';
export { useAnalytics, createAnalyticsTracker } from './hooks/use-analytics';

// Utilities
export { htmlToMarkdown } from './utils/html-to-markdown';
export { copyToClipboard } from './utils/clipboard';
export { downloadAsFile } from './utils/download';

// Server utilities (re-export from server entry)
export { generateMarkdown, generateMarkdownString, contentToPlainText } from './server/generate-markdown';
export { generateLLMsTxt } from './server/generate-llms-txt';

// API handlers (re-export from api entry)
export { createLLMsTxtHandler, createLLMsTxtPageHandler } from './api/llms-txt-handler';
export type { LLMsTxtHandlerOptions } from './api/llms-txt-handler';
export { createMarkdownHandler, withLLMParam, hasLLMParam } from './api/markdown-handler';
export {
  createAnalyticsHandler,
  createAnalyticsPageHandler,
  createInMemoryStorage,
  aggregateEvents,
  getEventsForContent,
} from './api/analytics-handler';

// Types
export type {
  // Core types
  LLMContent,
  MarkdownOutput,
  TOCHeading,
  CopyAction,

  // Component props
  CopyButtonProps,
  CopyDropdownProps,
  TOCProps,
  LLMBadgeProps,
  DropdownMenuItem,

  // Hook types
  UseLLMCopyOptions,
  UseLLMCopyReturn,
  UseTOCOptions,
  UseTOCReturn,
  UseAnalyticsOptions,
  UseAnalyticsReturn,

  // API types
  LLMsTxtConfig,
  LLMsTxtItem,
  MarkdownHandlerOptions,
  AnalyticsHandlerOptions,
  AnalyticsEvent,
  AnalyticsStorageAdapter,

  // Config types
  LLMReadyConfig,
  ThemeConfig,
  AnalyticsConfig,
  HTMLToMarkdownOptions,
  DownloadOptions,
} from './types';
