/**
 * NewsCard Component - Redesigned
 * Layout: Title (colored bg) -> Images (gallery - all images) -> Description
 * Design: Modern Minimalist with colored title backgrounds
 * Shows: Main image + Additional images list
 * Features: Clickable link to detail page
 */

import Link from "next/link";
import { createSlugWithId } from "@/lib/slug";
import ImageGallery from "./ImageGallery";

interface NewsCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  category_label: string;
  image?: string;
  images?: string[];
  created_at: string;
  author: string;
  title_bg_color?: string;
}

export default function NewsCard({
  id,
  title,
  description,
  category,
  category_label,
  image,
  images,
  created_at,
  author,
  title_bg_color = "#ef4444",
}: NewsCardProps) {
  // Category color mapping for fallback
  const categoryColors: Record<string, string> = {
    sports: "#ef4444",
    economy: "#10b981",
    politics: "#a855f7",
    society: "#3b82f6",
    humor: "#f59e0b",
  };

  const bgColor = title_bg_color || categoryColors[category] || "#ef4444";

  // Prepare images array - combine main image + additional images
  const imagesList: string[] = [];

  // Add main image first if exists
  if (image) {
    imagesList.push(image);
  }

  // Add additional images if exist
  if (images && images.length > 0) {
    imagesList.push(...images);
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const slug = createSlugWithId(title, id);

  return (
    <Link href={`/${slug}`}>
      <article className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform mb-8">
      {/* Title Section - Colored Background */}
      <div
        className="px-4 sm:px-5 py-4 sm:py-5 text-white"
        style={{ backgroundColor: bgColor }}
      >
        <h2 className="text-xl sm:text-2xl font-bold leading-tight line-clamp-3">
          {title}
        </h2>
        {/* Category Badge */}
        <div className="mt-2 inline-block bg-white/20 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide">
          {category_label}
        </div>
      </div>

      {/* Images Gallery Section - All images (main + additional) displayed vertically */}
      {imagesList.length > 0 && (
        <div className="w-full px-4 sm:px-5 pt-4 sm:pt-5">
          <ImageGallery images={imagesList} title={title} />
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
          {description}
        </p>

        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 mb-3" />

        {/* Meta Information */}
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span className="font-medium">{author}</span>
            <span className="ml-2">{formatDate(created_at)}</span>
          </div>
        </div>
      </div>
      </article>
    </Link>
  );
}
