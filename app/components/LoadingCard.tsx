/**
 * LoadingCard Component
 * Displays a skeleton loading state for news cards
 * Design: Modern Minimalist - subtle, non-intrusive
 */

export default function LoadingCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 sm:h-56 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4 sm:p-5">
        {/* Title Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>

        {/* Divider Skeleton */}
        <div className="w-8 h-px bg-gray-200 mb-3" />

        {/* Meta Skeleton */}
        <div className="flex justify-between">
          <div className="h-3 bg-gray-100 rounded w-1/4" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
