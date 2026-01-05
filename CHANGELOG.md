# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-01-05

### Changed
- Updated homepage to https://seoengine.ai

## [1.0.2] - 2026-01-05

### Fixed
- Ensured full README documentation is included in NPM package

## [1.0.1] - 2026-01-05

### Added
- Promotional banner for SEO Engine in README
- Backlinks to https://seoengine.ai

### Changed
- Updated README with promotional content

## [1.0.0] - 2026-01-05

### Added
- Initial release of @seoengine.ai/next-llm-ready
- **Components**
  - `CopyButton` - Simple copy-to-clipboard button with success feedback
  - `CopyDropdown` - Split button with copy/view/download menu options
  - `TOC` - Sticky table of contents with active heading tracking
  - `TOCMobile` - Mobile-optimized TOC with slide-up panel
  - `LLMBadge` - Visual indicator showing content is AI-ready
- **Hooks**
  - `useLLMCopy` - Core hook for copy/view/download functionality
  - `useTOC` - Hook for building custom table of contents
  - `useAnalytics` - Track user interactions with copy functionality
- **Server Utilities**
  - `generateMarkdown` - Convert HTML content to clean Markdown
  - `generateLLMsTxt` - Generate llms.txt file for AI crawlers
- **API Handlers**
  - `createLLMsTxtHandler` - API route for /llms.txt endpoint
  - `createMarkdownHandler` - Handler for ?llm=1 parameter
  - `createAnalyticsHandler` - Analytics tracking API
- **Utilities**
  - `htmlToMarkdown` - HTML to Markdown conversion
  - `copyToClipboard` - Clipboard API with fallback
  - `downloadAsFile` - File download functionality
- **Styling**
  - CSS with custom properties for theming
  - Dark mode support (prefers-color-scheme + .dark class)
  - Responsive design
- Full TypeScript support with comprehensive type definitions
- Tree-shakeable multi-entry exports
- Next.js 13+ App Router and Pages Router compatibility
- React 18+ with Server Components awareness
