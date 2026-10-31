/**
 * Client-Side HTML Sanitizer
 * Uses native browser DOMParser to safely parse and sanitize rich text,
 * preventing Cross-Site Scripting (XSS) without external runtime dependencies.
 */

const ALLOWED_TAGS = new Set([
  'P', 'STRONG', 'B', 'EM', 'I', 'U', 'BR', 'HR',
  'UL', 'OL', 'LI', 'SPAN', 'DIV', 'BLOCKQUOTE',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A'
]);

const ALLOWED_SCHEMES = ['http:', 'https:', 'mailto:'];

export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  function cleanNode(node) {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        // 1. Remove disallowed tags (scripts, iframes, objects, embeds, forms, etc.)
        if (!ALLOWED_TAGS.has(child.tagName)) {
          child.remove();
          continue;
        }

        // 2. Remove all attributes except explicitly safe ones
        const attrs = Array.from(child.attributes);
        for (const attr of attrs) {
          const name = attr.name.toLowerCase();
          const val = attr.value.trim().toLowerCase();

          // Reject any inline event handlers (onerror, onload, onclick, etc.)
          if (name.startsWith('on')) {
            child.removeAttribute(attr.name);
            continue;
          }

          if (child.tagName === 'A' && name === 'href') {
            try {
              const url = new URL(val, window.location.origin);
              if (ALLOWED_SCHEMES.includes(url.protocol)) {
                child.setAttribute('target', '_blank');
                child.setAttribute('rel', 'noopener noreferrer');
              } else {
                child.removeAttribute(attr.name);
              }
            } catch {
              child.removeAttribute(attr.name);
            }
          } else if (name === 'class') {
            // Keep safe CSS classes
            continue;
          } else {
            // Discard style, id, target, or any other attribute
            child.removeAttribute(attr.name);
          }
        }

        // Recursively clean descendants
        cleanNode(child);
      }
    }
  }

  cleanNode(doc.body);
  return doc.body.innerHTML;
}
