// Strip HTML tags from a string

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};
