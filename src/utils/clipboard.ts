/**
 * Clipboard Utilities
 * Cross-browser clipboard operations
 */

/**
 * Copy text to clipboard
 * Uses modern Clipboard API with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fall through to fallback
      console.warn('Clipboard API failed, using fallback:', err);
    }
  }

  // Fallback for older browsers or when Clipboard API fails
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback copy method using execCommand
 */
function fallbackCopyToClipboard(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Make the textarea invisible
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  // Prevent zooming on iOS
  textarea.style.fontSize = '16px';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    document.body.removeChild(textarea);
    return false;
  }
}

/**
 * Check if clipboard is supported
 */
export function isClipboardSupported(): boolean {
  return !!(
    (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') ||
    document.queryCommandSupported?.('copy')
  );
}

/**
 * Read text from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      console.warn('Failed to read from clipboard:', err);
      return null;
    }
  }
  return null;
}
