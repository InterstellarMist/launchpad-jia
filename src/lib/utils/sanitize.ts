// This module is server-only - isomorphic-dompurify handles both client and server automatically
import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(html: string) {
  if (!html || typeof html !== "string") {
    return "";
  }

  try {
    return DOMPurify.sanitize(html, {
      FORBID_TAGS: ["script", "style"],
      FORBID_ATTR: ["style", "on*"],
      ALLOWED_TAGS: [
        "p",
        "br",
        "b",
        "i",
        "u",
        "s",
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
      ],
      ALLOWED_ATTR: [
        "href",
        "target",
        "rel",
        "src",
        "alt",
        "width",
        "height",
        "class",
        "id",
      ],
    });
  } catch (error) {
    console.error("Error sanitizing HTML:", error);
    // Fallback: return empty string
    return "";
  }
}

export function sanitizeText(text: string) {
  if (!text || typeof text !== "string") {
    return "";
  }

  try {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  } catch (error) {
    console.error("Error sanitizing text:", error);
    // Fallback: return the text as-is (it will be treated as plain text)
    return text;
  }
}
