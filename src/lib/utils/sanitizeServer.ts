/**
 * Server-side sanitization functions that don't use DOMPurify/jsdom
 * These are lightweight regex-based sanitizers for API routes
 */

// Allowed HTML tags for rich text content
const ALLOWED_TAGS = [
  "p",
  "br",
  "b",
  "i",
  "u",
  "s",
  "strong",
  "em",
  "a",
  "img",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "hr",
  "table",
  "tbody",
  "tr",
  "td",
  "th",
  "thead",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "div",
  "span",
];

// Allowed attributes
const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "class",
  "id",
  "title",
];

/**
 * Sanitize HTML by removing dangerous tags and attributes
 * This is a simplified regex-based sanitizer for server-side use
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  try {
    let sanitized = html;

    // Remove script tags and their content (including nested tags)
    sanitized = sanitized.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    // Remove style tags and their content
    sanitized = sanitized.replace(
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
      ""
    );

    // Remove iframe, embed, object tags (potential XSS vectors)
    sanitized = sanitized.replace(
      /<\/?(iframe|embed|object|form|input|button)\b[^>]*>/gi,
      ""
    );

    // Remove event handlers (onclick, onerror, onload, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

    // Remove javascript: and data: protocols
    sanitized = sanitized.replace(/javascript:/gi, "");
    sanitized = sanitized.replace(/data:text\/html/gi, "");

    // Remove style attributes (could contain XSS)
    sanitized = sanitized.replace(/\s*style\s*=\s*["'][^"']*["']/gi, "");

    // Remove all attributes from tags, then we'll add back only safe ones
    // This is a simplified approach - for production, consider a proper HTML parser
    const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    sanitized = sanitized.replace(tagPattern, (match) => {
      // Extract tag name
      const tagMatch = match.match(/<\/?([a-z][a-z0-9]*)/i);
      if (!tagMatch) return "";

      const tagName = tagMatch[1].toLowerCase();
      const isClosing = match.startsWith("</");

      // If it's a closing tag, return it as-is if allowed
      if (isClosing) {
        return ALLOWED_TAGS.includes(tagName) ? `</${tagName}>` : "";
      }

      // If it's an opening tag and allowed, return just the tag name
      // We'll keep the tag but strip all attributes for safety
      // In a production app, you might want to preserve safe attributes
      return ALLOWED_TAGS.includes(tagName) ? `<${tagName}>` : "";
    });

    return sanitized;
  } catch (error) {
    console.error("Error sanitizing HTML:", error);
    // Fallback: strip all HTML tags but keep text content
    return html.replace(/<[^>]*>/g, "");
  }
}

/**
 * Sanitize text by removing all HTML tags
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  try {
    // Remove all HTML tags
    let sanitized = text.replace(/<[^>]*>/g, "");

    // Decode HTML entities
    sanitized = sanitized
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");

    // Remove any remaining dangerous characters
    sanitized = sanitized.replace(/javascript:/gi, "");
    sanitized = sanitized.replace(/on\w+\s*=/gi, "");

    return sanitized.trim();
  } catch (error) {
    console.error("Error sanitizing text:", error);
    // Fallback: return text with HTML stripped
    return text.replace(/<[^>]*>/g, "").trim();
  }
}
