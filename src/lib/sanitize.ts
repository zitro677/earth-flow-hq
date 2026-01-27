/**
 * Sanitizes a string by escaping HTML special characters to prevent XSS attacks.
 * Use this for any user-provided content that will be rendered as HTML.
 */
export function escapeHtml(unsafe: string | null | undefined): string {
  if (unsafe == null) return '';
  
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes text for safe inclusion in HTML, preserving line breaks as <br> tags.
 * Only use when you specifically need to preserve line breaks in user content.
 */
export function escapeHtmlWithLineBreaks(unsafe: string | null | undefined): string {
  if (unsafe == null) return '';
  
  return escapeHtml(unsafe).replace(/\n/g, '<br>');
}
