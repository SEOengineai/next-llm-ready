/**
 * Hooks Export
 * Headless hooks for custom implementations
 */

export { useLLMCopy, useContentStats } from './use-llm-copy';
export { useTOC, buildNestedTOC, useTOCKeyboard } from './use-toc';
export { useAnalytics, createAnalyticsTracker } from './use-analytics';

// Re-export hook-related types
export type {
  UseLLMCopyOptions,
  UseLLMCopyReturn,
  UseTOCOptions,
  UseTOCReturn,
  UseAnalyticsOptions,
  UseAnalyticsReturn,
  CopyAction,
  AnalyticsEvent,
} from '../types';
