/**
 * HTML to Markdown Converter
 * Converts HTML content to clean markdown format
 */

import type { HTMLToMarkdownOptions } from '../types';

const defaultOptions: HTMLToMarkdownOptions = {
  preserveLineBreaks: true,
  convertImages: true,
  convertLinks: true,
  stripScripts: true,
  customHandlers: {},
};

/**
 * Convert HTML string to Markdown
 */
export function htmlToMarkdown(
  html: string,
  options: HTMLToMarkdownOptions = {}
): string {
  const opts = { ...defaultOptions, ...options };

  // Create a temporary DOM element to parse HTML
  if (typeof window === 'undefined') {
    // Server-side: use basic regex conversion
    return serverSideConvert(html, opts);
  }

  // Client-side: use DOM parsing
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return convertNode(doc.body, opts);
}

/**
 * Server-side HTML to Markdown conversion (regex-based)
 */
function serverSideConvert(html: string, opts: HTMLToMarkdownOptions): string {
  let markdown = html;

  // Strip scripts and styles
  if (opts.stripScripts) {
    markdown = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    markdown = markdown.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  }

  // Headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n');

  // Bold and italic
  markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**');
  markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*');

  // Links
  if (opts.convertLinks) {
    markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  }

  // Images
  if (opts.convertImages) {
    markdown = markdown.replace(
      /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi,
      '![$2]($1)'
    );
    markdown = markdown.replace(
      /<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi,
      '![$1]($2)'
    );
    markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![]($1)');
  }

  // Lists
  markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
  markdown = markdown.replace(/<\/ul>/gi, '\n');
  markdown = markdown.replace(/<ol[^>]*>/gi, '\n');
  markdown = markdown.replace(/<\/ol>/gi, '\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, content) => {
    return '\n> ' + content.trim().replace(/\n/g, '\n> ') + '\n';
  });

  // Code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '\n```\n$1\n```\n');
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Paragraphs and line breaks
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gis, '\n$1\n');
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

  // Horizontal rules
  markdown = markdown.replace(/<hr[^>]*\/?>/gi, '\n---\n');

  // Strip remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  markdown = decodeHTMLEntities(markdown);

  // Clean up whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}

/**
 * Client-side DOM-based conversion
 */
function convertNode(node: Node, opts: HTMLToMarkdownOptions): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();

  // Check for custom handler
  if (opts.customHandlers?.[tagName]) {
    return opts.customHandlers[tagName](element);
  }

  // Skip scripts and styles
  if (opts.stripScripts && (tagName === 'script' || tagName === 'style')) {
    return '';
  }

  const childContent = Array.from(element.childNodes)
    .map((child) => convertNode(child, opts))
    .join('');

  switch (tagName) {
    case 'h1':
      return `\n# ${childContent.trim()}\n`;
    case 'h2':
      return `\n## ${childContent.trim()}\n`;
    case 'h3':
      return `\n### ${childContent.trim()}\n`;
    case 'h4':
      return `\n#### ${childContent.trim()}\n`;
    case 'h5':
      return `\n##### ${childContent.trim()}\n`;
    case 'h6':
      return `\n###### ${childContent.trim()}\n`;
    case 'p':
      return `\n${childContent.trim()}\n`;
    case 'br':
      return opts.preserveLineBreaks ? '\n' : ' ';
    case 'strong':
    case 'b':
      return `**${childContent}**`;
    case 'em':
    case 'i':
      return `*${childContent}*`;
    case 'u':
      return `_${childContent}_`;
    case 's':
    case 'strike':
    case 'del':
      return `~~${childContent}~~`;
    case 'a':
      if (opts.convertLinks) {
        const href = element.getAttribute('href') || '';
        return `[${childContent}](${href})`;
      }
      return childContent;
    case 'img':
      if (opts.convertImages) {
        const src = element.getAttribute('src') || '';
        const alt = element.getAttribute('alt') || '';
        return `![${alt}](${src})`;
      }
      return '';
    case 'ul':
      return `\n${childContent}\n`;
    case 'ol':
      return `\n${childContent}\n`;
    case 'li':
      return `- ${childContent.trim()}\n`;
    case 'blockquote':
      return `\n> ${childContent.trim().replace(/\n/g, '\n> ')}\n`;
    case 'pre':
      const codeElement = element.querySelector('code');
      const lang = codeElement?.className.match(/language-(\w+)/)?.[1] || '';
      const code = codeElement?.textContent || childContent;
      return `\n\`\`\`${lang}\n${code.trim()}\n\`\`\`\n`;
    case 'code':
      // Check if inside pre
      if (element.parentElement?.tagName.toLowerCase() === 'pre') {
        return childContent;
      }
      return `\`${childContent}\``;
    case 'hr':
      return '\n---\n';
    case 'table':
      return convertTable(element);
    case 'div':
    case 'section':
    case 'article':
    case 'main':
    case 'aside':
    case 'header':
    case 'footer':
    case 'nav':
      return childContent;
    default:
      return childContent;
  }
}

/**
 * Convert HTML table to Markdown table
 */
function convertTable(table: Element): string {
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return '';

  let markdown = '\n';
  let headerProcessed = false;

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('th, td');
    const rowContent = Array.from(cells)
      .map((cell) => cell.textContent?.trim() || '')
      .join(' | ');

    markdown += `| ${rowContent} |\n`;

    // Add separator after header row
    if (!headerProcessed && (row.querySelector('th') || index === 0)) {
      const separator = Array.from(cells)
        .map(() => '---')
        .join(' | ');
      markdown += `| ${separator} |\n`;
      headerProcessed = true;
    }
  });

  return markdown + '\n';
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }

  // Decode numeric entities
  result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  result = result.replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  return result;
}

/**
 * Calculate word count from text
 */
export function countWords(text: string): number {
  return text
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Extract headings from HTML for TOC
 */
export function extractHeadings(
  html: string,
  levels: string[] = ['h2', 'h3', 'h4']
): Array<{ id: string; text: string; level: number }> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const levelPattern = levels.join('|');
  const regex = new RegExp(
    `<(${levelPattern})[^>]*(?:id=["']([^"']*)["'])?[^>]*>(.*?)<\\/\\1>`,
    'gi'
  );

  let match;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1].charAt(1), 10);
    const id = match[2] || `heading-${index}`;
    const text = match[3].replace(/<[^>]+>/g, '').trim();

    headings.push({ id, text, level });
    index++;
  }

  return headings;
}
