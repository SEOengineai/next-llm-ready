# @seoengine.ai/next-llm-ready

<p align="center">
  <a href="https://seoengine.ai/?ref=next-llm-ready">
    <img src="https://img.lightshot.app/vlRu5KRPTXq2f0QPxeXO2A.png" alt="SEO Engine - AI-Powered SEO Platform" width="100%" />
  </a>
</p>

<p align="center">
  <strong>🚀 Built by <a href="https://seoengine.ai/?ref=next-llm-ready">SEO Engine</a></strong> — The AI-powered platform that helps you rank higher, drive more traffic, and convert visitors into customers. <a href="https://seoengine.ai/?ref=next-llm-ready">Try it free →</a>
</p>

---

<p align="center">
  <img src="https://img.shields.io/npm/v/@seoengine.ai/next-llm-ready.svg" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/@seoengine.ai/next-llm-ready.svg" alt="npm downloads" />
  <img src="https://img.shields.io/github/license/SEOengineai/next-llm-ready.svg" alt="license" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-13%2B-black.svg" alt="Next.js" />
</p>

<p align="center">
  <strong>Make your Next.js content AI-ready in seconds.</strong><br>
  Copy buttons, Table of Contents, `/llms.txt` endpoint, and `?llm=1` query support.
</p>

---

## Why next-llm-ready?

Large Language Models (LLMs) like ChatGPT, Claude, and Gemini are increasingly used to consume web content. **next-llm-ready** makes your Next.js content instantly accessible to AI assistants by:

- **One-click copy** - Users can copy your content as clean Markdown
- **LLM-optimized endpoints** - `/llms.txt` and `?llm=1` for AI crawlers
- **Table of Contents** - Auto-generated navigation with active heading tracking
- **Analytics** - Track how users interact with your AI-ready content
- **Zero config** - Works out of the box with sensible defaults

## Quick Start

### Installation

```bash
npm install @seoengine.ai/next-llm-ready
# or
yarn add @seoengine.ai/next-llm-ready
# or
pnpm add @seoengine.ai/next-llm-ready
```

### Import Styles

```tsx
// app/layout.tsx or _app.tsx
import '@seoengine.ai/next-llm-ready/styles.css';
```

### Add Copy Button

```tsx
import { CopyButton } from '@seoengine.ai/next-llm-ready';

export default function Article({ title, content, url }) {
  return (
    <article>
      <CopyButton
        content={{ title, content, url }}
        text="Copy for AI"
      />
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
```

**That's it!** Your content is now AI-ready.

---

## Features

| Feature | Description |
|---------|-------------|
| [CopyButton](#copybutton) | Simple copy button with success feedback |
| [CopyDropdown](#copydropdown) | Split button with copy/view/download menu |
| [TOC](#toc) | Sticky table of contents with active tracking |
| [LLMBadge](#llmbadge) | Visual indicator that content is AI-ready |
| [useLLMCopy](#usellmcopy) | Hook for custom copy implementations |
| [useTOC](#usetoc) | Hook for custom TOC implementations |
| [/llms.txt](#llmstxt-endpoint) | Sitemap-like file for AI crawlers |
| [?llm=1](#llm1-query-parameter) | Markdown version of any page |
| [Analytics](#analytics) | Track copy events and engagement |

---

## Components

### CopyButton

Simple button that copies content as Markdown to clipboard.

```tsx
import { CopyButton } from '@seoengine.ai/next-llm-ready';

<CopyButton
  content={{
    title: "Getting Started with Next.js",
    content: "<p>Next.js is a React framework...</p>",
    url: "https://example.com/nextjs-guide",
    author: "John Doe",
    publishedAt: "2024-01-15",
    tags: ["nextjs", "react", "tutorial"]
  }}
  text="Copy for AI"
  toastMessage="Copied!"
  position="inline" // 'inline' | 'fixed' | 'sticky'
  keyboardShortcut={true} // Ctrl/Cmd + Shift + C
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `LLMContent` | required | Content to copy |
| `text` | `string` | `'Copy'` | Button text |
| `position` | `'inline' \| 'fixed' \| 'sticky'` | `'inline'` | Button positioning |
| `keyboardShortcut` | `boolean` | `true` | Enable Ctrl/Cmd+Shift+C |
| `toastMessage` | `string` | `'Copied!'` | Success message |
| `toastDuration` | `number` | `2000` | Toast display time (ms) |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | `''` | Additional CSS classes |
| `onCopy` | `(action: CopyAction) => void` | - | Copy callback |
| `onError` | `(error: Error) => void` | - | Error callback |
| `onAnalytics` | `(event: AnalyticsEvent) => void` | - | Analytics callback |

### CopyDropdown

Split button with dropdown menu for copy, view, and download options.

```tsx
import { CopyDropdown } from '@seoengine.ai/next-llm-ready';

<CopyDropdown
  content={{
    title: "API Documentation",
    content: "<h2>Authentication</h2><p>Use Bearer tokens...</p>",
    url: "https://docs.example.com/api",
  }}
  text="Copy for AI"
  menuItems={[
    { id: 'copy', label: 'Copy to clipboard', action: 'copy', shortcut: '⌘+Shift+C' },
    { id: 'view', label: 'View markdown', action: 'view' },
    { id: 'download', label: 'Download .md file', action: 'download' },
  ]}
/>
```

#### Props

Extends `CopyButtonProps` with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuItems` | `DropdownMenuItem[]` | Default items | Menu options |

#### Menu Item

```tsx
interface DropdownMenuItem {
  id: string;
  label: string;
  action: 'copy' | 'view' | 'download' | (() => void);
  icon?: React.ReactNode;
  shortcut?: string;
}
```

### TOC

Sticky table of contents with active heading highlighting.

```tsx
'use client';

import { useRef } from 'react';
import { TOC } from '@seoengine.ai/next-llm-ready';

export default function Article({ content }) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="article-layout">
      <TOC
        contentRef={contentRef}
        title="On This Page"
        levels={['h2', 'h3']}
        sticky
        stickyOffset={80}
        position="right"
        highlightActive
        collapsible
      />
      <article ref={contentRef}>
        <h2 id="intro">Introduction</h2>
        <p>Content here...</p>
        <h3 id="setup">Setup</h3>
        <p>More content...</p>
      </article>
    </div>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contentRef` | `RefObject<HTMLElement>` | - | Reference to content container |
| `headings` | `TOCHeading[]` | - | Manual headings (optional) |
| `title` | `string` | `'On This Page'` | TOC title |
| `levels` | `HeadingLevel[]` | `['h2', 'h3', 'h4']` | Heading levels to include |
| `position` | `'left' \| 'right'` | `'right'` | TOC position |
| `sticky` | `boolean` | `true` | Enable sticky positioning |
| `stickyOffset` | `number` | `80` | Top offset when sticky (px) |
| `smoothScroll` | `boolean` | `true` | Smooth scroll on click |
| `highlightActive` | `boolean` | `true` | Highlight active heading |
| `collapsible` | `boolean` | `true` | Allow collapsing |
| `defaultCollapsed` | `boolean` | `false` | Start collapsed |

### TOCMobile

Mobile-optimized TOC with slide-up panel.

```tsx
import { TOCMobile } from '@seoengine.ai/next-llm-ready';

// Same props as TOC
<TOCMobile contentRef={contentRef} />
```

### LLMBadge

Visual indicator showing content is AI-ready.

```tsx
import { LLMBadge } from '@seoengine.ai/next-llm-ready';

<LLMBadge
  text="AI Ready"
  size="md" // 'sm' | 'md' | 'lg'
  showTooltip
  tooltipContent="This content is optimized for AI assistants"
/>
```

---

## Hooks

### useLLMCopy

Core hook for implementing custom copy functionality.

```tsx
'use client';

import { useLLMCopy } from '@seoengine.ai/next-llm-ready/hooks';

function CustomCopyButton({ content }) {
  const { copy, view, download, markdown, isCopying, isSuccess, error } = useLLMCopy({
    content,
    onSuccess: (action) => console.log(`${action} completed`),
    onError: (err) => console.error(err),
  });

  return (
    <div>
      <button onClick={copy} disabled={isCopying}>
        {isSuccess ? 'Copied!' : 'Copy'}
      </button>
      <button onClick={() => { view(); alert(markdown); }}>View</button>
      <button onClick={download}>Download</button>
    </div>
  );
}
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `content` | `LLMContent` | Content to process |
| `onSuccess` | `(action: CopyAction) => void` | Success callback |
| `onError` | `(error: Error) => void` | Error callback |
| `onAnalytics` | `(event: AnalyticsEvent) => void` | Analytics callback |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `copy` | `() => Promise<boolean>` | Copy to clipboard |
| `view` | `() => string` | Get markdown content |
| `download` | `() => void` | Download as .md file |
| `markdown` | `string` | Generated markdown |
| `isCopying` | `boolean` | Copy in progress |
| `isSuccess` | `boolean` | Copy succeeded |
| `error` | `Error \| null` | Last error |

### useTOC

Hook for building custom table of contents.

```tsx
'use client';

import { useTOC } from '@seoengine.ai/next-llm-ready/hooks';

function CustomTOC({ contentRef }) {
  const { headings, activeId, scrollTo } = useTOC({
    contentRef,
    levels: ['h2', 'h3'],
  });

  return (
    <nav>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollTo(heading.id);
          }}
          style={{ fontWeight: activeId === heading.id ? 'bold' : 'normal' }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `contentRef` | `RefObject<HTMLElement>` | Content container |
| `levels` | `HeadingLevel[]` | Heading levels |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `headings` | `TOCHeading[]` | Extracted headings |
| `activeId` | `string \| null` | Current active heading |
| `scrollTo` | `(id: string) => void` | Scroll to heading |

### useAnalytics

Track user interactions with copy functionality.

```tsx
'use client';

import { useAnalytics } from '@seoengine.ai/next-llm-ready/hooks';

function TrackedComponent() {
  const { track } = useAnalytics({
    endpoint: '/api/analytics',
    contentId: 'article-123',
  });

  return (
    <button onClick={() => track('copy')}>
      Copy
    </button>
  );
}
```

---

## Server Utilities

### generateMarkdown

Convert HTML content to clean Markdown.

```tsx
import { generateMarkdown } from '@seoengine.ai/next-llm-ready/server';

const markdown = generateMarkdown({
  title: 'My Article',
  content: '<p>Hello <strong>world</strong>!</p>',
  url: 'https://example.com/article',
  author: 'John Doe',
  publishedAt: '2024-01-15',
});

// Output:
// # My Article
//
// **Source:** https://example.com/article
// **Author:** John Doe
// **Published:** 2024-01-15
//
// ---
//
// Hello **world**!
```

### generateLLMsTxt

Generate an llms.txt file for your site.

```tsx
import { generateLLMsTxt } from '@seoengine.ai/next-llm-ready/server';

const llmsTxt = generateLLMsTxt({
  siteName: 'My Documentation',
  description: 'API documentation and guides',
  baseUrl: 'https://docs.example.com',
  pages: [
    {
      title: 'Getting Started',
      url: '/getting-started',
      description: 'Quick start guide',
    },
    {
      title: 'API Reference',
      url: '/api-reference',
      description: 'Complete API documentation',
    },
  ],
});
```

---

## API Handlers

### /llms.txt Endpoint

Create an `/llms.txt` endpoint for AI crawlers.

#### App Router (Next.js 13+)

```tsx
// app/llms.txt/route.ts
import { createLLMsTxtHandler } from '@seoengine.ai/next-llm-ready/api';
import { getAllPages } from '@/lib/content';

export const GET = createLLMsTxtHandler({
  siteName: 'My Documentation',
  description: 'Technical documentation and guides',
  getPages: async () => {
    const pages = await getAllPages();
    return pages.map((page) => ({
      title: page.title,
      url: page.slug,
      description: page.excerpt,
    }));
  },
});
```

#### Pages Router

```tsx
// pages/llms.txt.ts
import { createLLMsTxtHandler } from '@seoengine.ai/next-llm-ready/api';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = createLLMsTxtHandler({
  siteName: 'My Site',
  getPages: async () => [
    { title: 'Home', url: '/', description: 'Welcome' },
  ],
});

export default async function llmsTxt(req: NextApiRequest, res: NextApiResponse) {
  const response = await handler(req as any);
  res.setHeader('Content-Type', 'text/plain');
  res.send(await response.text());
}
```

### ?llm=1 Query Parameter

Serve Markdown version of any page.

#### Middleware Approach

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.searchParams.get('llm') === '1') {
    // Rewrite to markdown endpoint
    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ['/blog/:path*', '/docs/:path*'],
};
```

#### API Route Handler

```tsx
// app/api/markdown/[...slug]/route.ts
import { createMarkdownHandler } from '@seoengine.ai/next-llm-ready/api';
import { getPageBySlug } from '@/lib/content';

export const GET = createMarkdownHandler({
  getContent: async (slug) => {
    const page = await getPageBySlug(slug);
    if (!page) return null;

    return {
      title: page.title,
      content: page.content,
      url: `https://example.com/${slug}`,
      author: page.author,
      publishedAt: page.publishedAt,
    };
  },
});
```

---

## Analytics

Track how users interact with your AI-ready content.

### Client-Side Tracking

```tsx
'use client';

import { CopyButton } from '@seoengine.ai/next-llm-ready';

<CopyButton
  content={content}
  onAnalytics={(event) => {
    // Send to your analytics provider
    gtag('event', 'llm_copy', {
      action: event.action,
      content_id: event.contentId,
    });
  }}
/>
```

### Server-Side Analytics API

```tsx
// app/api/llm-analytics/route.ts
import { createAnalyticsApiHandler } from '@seoengine.ai/next-llm-ready/api';

export const POST = createAnalyticsApiHandler({
  onEvent: async (event) => {
    // Store in database
    await db.analytics.create({
      data: {
        action: event.action,
        contentId: event.contentId,
        timestamp: new Date(),
      },
    });
  },
});
```

---

## Theming

All components use CSS custom properties for easy theming.

### Override Variables

```css
:root {
  /* Primary colors */
  --llm-ready-primary: #0070f3;
  --llm-ready-primary-hover: #0060df;

  /* Text colors */
  --llm-ready-text: #1f2937;
  --llm-ready-text-muted: #6b7280;

  /* Backgrounds */
  --llm-ready-bg: #ffffff;
  --llm-ready-bg-secondary: #f9fafb;

  /* Borders */
  --llm-ready-border: #e5e7eb;
  --llm-ready-radius: 8px;

  /* Shadows */
  --llm-ready-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Dark Mode

Automatic dark mode support via `prefers-color-scheme`, or use the `.dark` class:

```tsx
<body className={isDark ? 'dark' : ''}>
  <CopyButton content={content} />
</body>
```

### Tailwind CSS Integration

```tsx
<CopyButton
  content={content}
  className="rounded-lg shadow-lg hover:shadow-xl"
/>
```

---

## TypeScript

Full TypeScript support with exported types.

```tsx
import type {
  LLMContent,
  CopyButtonProps,
  TOCHeading,
  AnalyticsEvent,
} from '@seoengine.ai/next-llm-ready';

const content: LLMContent = {
  title: 'My Article',
  content: '<p>Content...</p>',
  url: 'https://example.com/article',
};
```

### Type Definitions

```tsx
interface LLMContent {
  title: string;
  content: string;        // HTML content
  url?: string;           // Canonical URL
  author?: string;        // Author name
  publishedAt?: string;   // ISO date string
  modifiedAt?: string;    // ISO date string
  tags?: string[];        // Content tags
  categories?: string[];  // Content categories
  excerpt?: string;       // Short description
  metadata?: Record<string, unknown>;
}

interface TOCHeading {
  id: string;
  text: string;
  level: number;
  children?: TOCHeading[];
}

type CopyAction = 'copy' | 'view' | 'download';

interface AnalyticsEvent {
  action: CopyAction;
  contentId?: string;
  contentTitle?: string;
  timestamp: number;
}
```

---

## Examples

### Blog Post Page

```tsx
// app/blog/[slug]/page.tsx
import { CopyDropdown, TOC, LLMBadge } from '@seoengine.ai/next-llm-ready';
import { getPost } from '@/lib/posts';

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  return (
    <div className="max-w-6xl mx-auto flex gap-8">
      {/* Sidebar TOC */}
      <aside className="hidden lg:block w-64">
        <TOC
          headings={post.headings}
          sticky
          stickyOffset={100}
        />
      </aside>

      {/* Main Content */}
      <article className="flex-1">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <LLMBadge />
            <CopyDropdown
              content={{
                title: post.title,
                content: post.content,
                url: `https://example.com/blog/${params.slug}`,
                author: post.author,
                publishedAt: post.publishedAt,
              }}
              text="Copy for AI"
            />
          </div>
          <h1>{post.title}</h1>
        </header>

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
```

### Documentation Site

```tsx
// app/docs/[...slug]/page.tsx
import { CopyButton, TOC, TOCMobile } from '@seoengine.ai/next-llm-ready';
import { getDoc } from '@/lib/docs';

export default async function DocPage({ params }) {
  const doc = await getDoc(params.slug.join('/'));

  return (
    <>
      {/* Mobile TOC */}
      <TOCMobile headings={doc.headings} />

      <div className="lg:grid lg:grid-cols-[1fr_250px] gap-8">
        <article>
          <div className="flex items-center justify-between mb-6">
            <h1>{doc.title}</h1>
            <CopyButton
              content={{
                title: doc.title,
                content: doc.content,
                url: `https://docs.example.com/${params.slug.join('/')}`,
              }}
              text="Copy"
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: doc.content }} />
        </article>

        {/* Desktop TOC */}
        <aside className="hidden lg:block">
          <TOC headings={doc.headings} sticky />
        </aside>
      </div>
    </>
  );
}
```

### Headless Implementation

Build completely custom UI with hooks:

```tsx
'use client';

import { useLLMCopy, useTOC } from '@seoengine.ai/next-llm-ready/hooks';
import { motion, AnimatePresence } from 'framer-motion';

function CustomCopyButton({ content }) {
  const { copy, isCopying, isSuccess } = useLLMCopy({ content });

  return (
    <motion.button
      onClick={copy}
      disabled={isCopying}
      animate={{ scale: isSuccess ? [1, 1.1, 1] : 1 }}
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Copied!
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Copy for AI
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses modern APIs:
- Clipboard API (with fallback)
- Intersection Observer
- CSS Custom Properties

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Clone the repository
git clone https://github.com/SEOengineai/next-llm-ready.git

# Install dependencies
pnpm install

# Run development
pnpm dev

# Run tests
pnpm test

# Build
pnpm build
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Related Projects

- [LLM Ready WordPress Plugin](https://wordpress.org/plugins/llm-ready/) - Original WordPress plugin
- [llms.txt Specification](https://llmstxt.org/) - Standard for AI-readable content

---

<p align="center">
  Made with  for the AI-first web
</p>
