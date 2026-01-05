/**
 * Server-side Markdown Generation
 * Generate LLM-ready markdown from content
 */

import type { LLMContent, MarkdownOutput, TOCHeading } from '../types';
import { htmlToMarkdown, countWords, calculateReadingTime } from '../utils/html-to-markdown';

/**
 * Generate complete markdown output from LLM content
 */
export function generateMarkdown(content: LLMContent): MarkdownOutput {
  const parts: string[] = [];

  // Add custom prompt prefix if set
  if (content.promptPrefix?.trim()) {
    parts.push(content.promptPrefix.trim());
    parts.push('');
  }

  // Title
  parts.push(`# ${content.title}`);
  parts.push('');

  // Excerpt as blockquote
  if (content.excerpt) {
    parts.push(`> ${content.excerpt}`);
    parts.push('');
  }

  // Metadata section
  parts.push('---');
  parts.push(`- **Source**: ${content.url}`);

  if (content.date) {
    parts.push(`- **Date**: ${content.date}`);
  }

  if (content.modifiedDate) {
    parts.push(`- **Modified**: ${content.modifiedDate}`);
  }

  if (content.author) {
    parts.push(`- **Author**: ${content.author}`);
  }

  if (content.categories?.length) {
    parts.push(`- **Categories**: ${content.categories.join(', ')}`);
  }

  if (content.tags?.length) {
    parts.push(`- **Tags**: ${content.tags.join(', ')}`);
  }

  if (content.readingTime) {
    parts.push(`- **Reading Time**: ${content.readingTime} min`);
  }

  parts.push('---');
  parts.push('');

  // Main content (convert HTML to markdown if needed)
  if (content.content) {
    const contentMarkdown = isHTML(content.content)
      ? htmlToMarkdown(content.content)
      : content.content;
    parts.push(contentMarkdown);
  }

  const markdown = parts.join('\n').trim();
  const wordCount = countWords(markdown);
  const readingTime = calculateReadingTime(markdown);
  const headings = extractMarkdownHeadings(markdown);

  return {
    markdown,
    wordCount,
    readingTime,
    headings,
  };
}

/**
 * Generate markdown string only (without metadata)
 */
export function generateMarkdownString(content: LLMContent): string {
  return generateMarkdown(content).markdown;
}

/**
 * Check if string contains HTML
 */
function isHTML(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Extract headings from markdown for TOC
 */
function extractMarkdownHeadings(markdown: string): TOCHeading[] {
  const headings: TOCHeading[] = [];
  const lines = markdown.split('\n');
  let index = 0;

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateSlug(text, index);

      headings.push({ id, text, level });
      index++;
    }
  }

  return headings;
}

/**
 * Generate URL-friendly slug from text
 */
function generateSlug(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `heading-${index}`;
}

/**
 * Convert LLMContent to plain text (for previews, etc.)
 */
export function contentToPlainText(content: LLMContent): string {
  const markdown = generateMarkdownString(content);
  return markdown
    .replace(/^#+\s+/gm, '') // Remove headings
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/^[-*+]\s+/gm, '') // Remove list markers
    .replace(/^>\s+/gm, '') // Remove blockquotes
    .replace(/^---$/gm, '') // Remove horizontal rules
    .replace(/\n{2,}/g, '\n\n') // Normalize line breaks
    .trim();
}
