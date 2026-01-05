/**
 * Download Utilities
 * File download functionality
 */

import type { DownloadOptions } from '../types';

const defaultOptions: DownloadOptions = {
  filename: 'content',
  extension: 'md',
  includeMetadata: false,
};

/**
 * Download content as a file
 */
export function downloadAsFile(
  content: string,
  options: DownloadOptions = {}
): void {
  const opts = { ...defaultOptions, ...options };
  const filename = sanitizeFilename(opts.filename || 'content');
  const fullFilename = `${filename}.${opts.extension}`;

  // Determine MIME type
  const mimeType = opts.extension === 'md' ? 'text/markdown' : 'text/plain';

  // Create blob and download
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fullFilename;

  // Required for Firefox
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename by removing/replacing invalid characters
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
    .substring(0, 100); // Limit length
}

/**
 * Generate filename from title
 */
export function generateFilename(title: string): string {
  const base = sanitizeFilename(title);
  const date = new Date().toISOString().split('T')[0];
  return `${base}-${date}`;
}
