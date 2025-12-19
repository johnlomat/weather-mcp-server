// Strip HTML tags and decode HTML entities from a string

export const stripHtml = (html: string): string => {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&#8211;": "\u2013", // en-dash
    "&#8212;": "\u2014", // em-dash
    "&#8216;": "\u2018", // left single quote
    "&#8217;": "\u2019", // right single quote
    "&#8220;": "\u201C", // left double quote
    "&#8221;": "\u201D", // right double quote
    "&#8230;": "\u2026", // ellipsis
  };

  for (const [entity, char] of Object.entries(entities)) {
    text = text.replace(new RegExp(entity, "g"), char);
  }

  // Decode numeric entities (&#NNN;)
  text = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  // Decode hex entities (&#xHHH;)
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));

  return text;
};
