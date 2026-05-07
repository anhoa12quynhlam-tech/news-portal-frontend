/**
 * Slug utilities for SEO-friendly URLs
 */

/**
 * Convert title to URL-friendly slug
 * Example: "Tin tức thể thao hôm nay" -> "tin-tuc-the-thao-hom-nay"
 */
export function createSlug(title: string): string {
  if (!title) return "";

  return title
    .toLowerCase()
    .trim()
    // Remove accents/diacritics
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    // Remove multiple consecutive hyphens
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Create slug with ID for uniqueness
 * Example: "tin-tuc-the-thao-hom-nay-42"
 */
export function createSlugWithId(title: string, id: number): string {
  const slug = createSlug(title);
  return `${slug}-${id}`;
}

/**
 * Extract ID from slug with ID
 * Example: "tin-tuc-the-thao-hom-nay-42" -> 42
 */
export function extractIdFromSlug(slugWithId: string): number | null {
  const parts = slugWithId.split("-");
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);
  return isNaN(id) ? null : id;
}
