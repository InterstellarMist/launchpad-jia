import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(html: string) {
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
}

export function sanitizeText(text: string) {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}
