/**
 * next-llm-ready - TypeScript Type Definitions
 * Make your Next.js content AI-ready
 */

// ============================================
// Core Types
// ============================================

/**
 * Content metadata for LLM-ready output
 */
export interface LLMContent {
  /** Page/post title */
  title: string;
  /** Main content (HTML or Markdown) */
  content: string;
  /** Short description/excerpt */
  excerpt?: string;
  /** Canonical URL */
  url: string;
  /** Publication date (ISO 8601) */
  date?: string;
  /** Last modified date (ISO 8601) */
  modifiedDate?: string;
  /** Author name */
  author?: string;
  /** Categories/sections */
  categories?: string[];
  /** Tags/keywords */
  tags?: string[];
  /** Custom prompt prefix for AI context */
  promptPrefix?: string;
  /** Featured image URL */
  image?: string;
  /** Reading time in minutes */
  readingTime?: number;
}

/**
 * Generated markdown output
 */
export interface MarkdownOutput {
  /** Raw markdown string */
  markdown: string;
  /** Word count */
  wordCount: number;
  /** Estimated reading time */
  readingTime: number;
  /** Extracted headings for TOC */
  headings: TOCHeading[];
}

// ============================================
// Component Props
// ============================================

/**
 * Position options for UI elements
 */
export type ButtonPosition = 'floating' | 'inline' | 'next-to-heading' | 'below-heading';

/**
 * TOC position options
 */
export type TOCPosition = 'left' | 'right' | 'inline-start' | 'inline-end';

/**
 * Heading levels to include in TOC
 */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Copy action types for analytics
 */
export type CopyAction = 'copy' | 'view' | 'download';

/**
 * CopyButton component props
 */
export interface CopyButtonProps {
  /** Content to copy (LLMContent object or markdown string) */
  content: LLMContent | string;
  /** Button text */
  text?: string;
  /** Show dropdown with additional options */
  showDropdown?: boolean;
  /** Button position */
  position?: ButtonPosition;
  /** Enable keyboard shortcut (Ctrl+Shift+C / Cmd+Shift+C) */
  keyboardShortcut?: boolean;
  /** Custom class name */
  className?: string;
  /** Toast message on copy */
  toastMessage?: string;
  /** Toast duration in ms */
  toastDuration?: number;
  /** Callback on successful copy */
  onCopy?: (action: CopyAction) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Analytics tracking function */
  onAnalytics?: (event: AnalyticsEvent) => void;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Disable the button */
  disabled?: boolean;
}

/**
 * CopyDropdown component props (split button with menu)
 */
export interface CopyDropdownProps extends Omit<CopyButtonProps, 'showDropdown'> {
  /** Dropdown menu items */
  menuItems?: DropdownMenuItem[];
}

/**
 * Dropdown menu item
 */
export interface DropdownMenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon?: React.ReactNode;
  /** Action to perform */
  action: CopyAction | (() => void);
  /** Keyboard shortcut hint */
  shortcut?: string;
}

/**
 * TOC (Table of Contents) component props
 */
export interface TOCProps {
  /** Content to extract headings from (HTML string or ref to content element) */
  content?: string;
  /** Reference to content container element */
  contentRef?: React.RefObject<HTMLElement>;
  /** Manually provided headings */
  headings?: TOCHeading[];
  /** Position of TOC */
  position?: TOCPosition;
  /** Heading levels to include */
  levels?: HeadingLevel[];
  /** Title for TOC section */
  title?: string;
  /** Sticky behavior */
  sticky?: boolean;
  /** Sticky offset from top (px) */
  stickyOffset?: number;
  /** Custom class name */
  className?: string;
  /** Smooth scroll behavior */
  smoothScroll?: boolean;
  /** Highlight active heading */
  highlightActive?: boolean;
  /** Collapsible on mobile */
  collapsible?: boolean;
  /** Initially collapsed */
  defaultCollapsed?: boolean;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Single TOC heading item
 */
export interface TOCHeading {
  /** Heading ID (for anchor links) */
  id: string;
  /** Heading text content */
  text: string;
  /** Heading level (1-6) */
  level: number;
  /** Child headings (for nested structure) */
  children?: TOCHeading[];
}

/**
 * MarkdownViewer modal props
 */
export interface MarkdownViewerProps {
  /** Markdown content to display */
  content: string;
  /** Modal open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Enable syntax highlighting */
  syntaxHighlight?: boolean;
  /** Title for the modal */
  title?: string;
  /** Show copy button in modal */
  showCopyButton?: boolean;
  /** Show download button in modal */
  showDownloadButton?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * LLMBadge component props (shows AI-ready indicator)
 */
export interface LLMBadgeProps {
  /** Badge text */
  text?: string;
  /** Show tooltip with info */
  showTooltip?: boolean;
  /** Tooltip content */
  tooltipContent?: string;
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class name */
  className?: string;
}

// ============================================
// Hook Types
// ============================================

/**
 * useLLMCopy hook options
 */
export interface UseLLMCopyOptions {
  /** Content to copy */
  content: LLMContent | string;
  /** Success callback */
  onSuccess?: (action: CopyAction) => void;
  /** Error callback */
  onError?: (error: Error) => void;
  /** Analytics callback */
  onAnalytics?: (event: AnalyticsEvent) => void;
}

/**
 * useLLMCopy hook return value
 */
export interface UseLLMCopyReturn {
  /** Copy to clipboard function */
  copy: () => Promise<boolean>;
  /** View markdown function (returns markdown string) */
  view: () => string;
  /** Download markdown function */
  download: (filename?: string) => void;
  /** Generated markdown */
  markdown: string;
  /** Copy in progress */
  isCopying: boolean;
  /** Last copy was successful */
  isSuccess: boolean;
  /** Last error */
  error: Error | null;
}

/**
 * useTOC hook options
 */
export interface UseTOCOptions {
  /** Content container ref */
  contentRef: React.RefObject<HTMLElement>;
  /** Heading levels to track */
  levels?: HeadingLevel[];
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number | number[];
}

/**
 * useTOC hook return value
 */
export interface UseTOCReturn {
  /** Extracted headings */
  headings: TOCHeading[];
  /** Currently active heading ID */
  activeId: string | null;
  /** Scroll to heading function */
  scrollTo: (id: string) => void;
}

/**
 * useAnalytics hook options
 */
export interface UseAnalyticsOptions {
  /** API endpoint for tracking */
  endpoint?: string;
  /** Include page URL */
  includeUrl?: boolean;
  /** Include timestamp */
  includeTimestamp?: boolean;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * useAnalytics hook return value
 */
export interface UseAnalyticsReturn {
  /** Track an event */
  track: (event: AnalyticsEvent) => Promise<void>;
  /** Track copy action */
  trackCopy: () => Promise<void>;
  /** Track view action */
  trackView: () => Promise<void>;
  /** Track download action */
  trackDownload: () => Promise<void>;
}

// ============================================
// Analytics Types
// ============================================

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  /** Event type */
  action: CopyAction;
  /** Page/content identifier */
  contentId?: string;
  /** Page URL */
  url?: string;
  /** Timestamp */
  timestamp?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Analytics handler config
 */
export interface AnalyticsConfig {
  /** Enable analytics */
  enabled?: boolean;
  /** API endpoint */
  endpoint?: string;
  /** Storage type */
  storage?: 'memory' | 'localStorage' | 'custom';
  /** Custom storage adapter */
  storageAdapter?: AnalyticsStorageAdapter;
  /** Batch events before sending */
  batchSize?: number;
  /** Flush interval in ms */
  flushInterval?: number;
}

/**
 * Custom analytics storage adapter
 */
export interface AnalyticsStorageAdapter {
  /** Save event */
  save: (event: AnalyticsEvent) => Promise<void>;
  /** Get all events */
  getAll: () => Promise<AnalyticsEvent[]>;
  /** Clear events */
  clear: () => Promise<void>;
}

// ============================================
// API/Server Types
// ============================================

/**
 * LLMs.txt endpoint configuration
 */
export interface LLMsTxtConfig {
  /** Site name */
  siteName: string;
  /** Site description */
  siteDescription?: string;
  /** Site URL */
  siteUrl: string;
  /** Content items to include */
  content: LLMsTxtItem[];
  /** Custom header text */
  headerText?: string;
  /** Custom footer text */
  footerText?: string;
}

/**
 * Single item in LLMs.txt listing
 */
export interface LLMsTxtItem {
  /** Content title */
  title: string;
  /** Page URL */
  url: string;
  /** Content type (post, page, etc.) */
  type?: string;
  /** Publication date */
  date?: string;
  /** Short description */
  description?: string;
}

/**
 * Markdown API handler options
 */
export interface MarkdownHandlerOptions {
  /** Function to fetch content by slug/id */
  getContent: (slug: string) => Promise<LLMContent | null>;
  /** Cache control header value */
  cacheControl?: string;
  /** Enable CORS */
  cors?: boolean;
}

/**
 * Analytics API handler options
 */
export interface AnalyticsHandlerOptions {
  /** Storage adapter */
  storage: AnalyticsStorageAdapter;
  /** Rate limiting (requests per minute) */
  rateLimit?: number;
  /** Enable CORS */
  cors?: boolean;
}

// ============================================
// Configuration Types
// ============================================

/**
 * Global LLM Ready configuration
 */
export interface LLMReadyConfig {
  /** Default button position */
  defaultPosition?: ButtonPosition;
  /** Default TOC position */
  defaultTOCPosition?: TOCPosition;
  /** Enable keyboard shortcuts globally */
  keyboardShortcuts?: boolean;
  /** Default prompt prefix */
  promptPrefix?: string;
  /** Analytics configuration */
  analytics?: AnalyticsConfig;
  /** Custom theme variables */
  theme?: ThemeConfig;
}

/**
 * Theme configuration (CSS variables)
 */
export interface ThemeConfig {
  /** Primary color */
  primaryColor?: string;
  /** Primary hover color */
  primaryHover?: string;
  /** Text color */
  textColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Border color */
  borderColor?: string;
  /** Border radius */
  borderRadius?: string;
  /** Font family */
  fontFamily?: string;
  /** Shadow */
  shadow?: string;
}

// ============================================
// Utility Types
// ============================================

/**
 * HTML to Markdown conversion options
 */
export interface HTMLToMarkdownOptions {
  /** Preserve line breaks */
  preserveLineBreaks?: boolean;
  /** Convert images to markdown */
  convertImages?: boolean;
  /** Convert links to markdown */
  convertLinks?: boolean;
  /** Strip scripts and styles */
  stripScripts?: boolean;
  /** Custom element handlers */
  customHandlers?: Record<string, (element: Element) => string>;
}

/**
 * Download options
 */
export interface DownloadOptions {
  /** Filename (without extension) */
  filename?: string;
  /** File extension */
  extension?: 'md' | 'txt';
  /** Include metadata header */
  includeMetadata?: boolean;
}
