/**
 * CategoryFilter Component
 * Allows users to filter news by category
 * Design: Modern Minimalist - clean, typography-driven, asymmetric
 */
"use client";
interface CategoryFilterProps {
  categories: Array<{ id: string; label: string }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <nav className="flex flex-wrap gap-2 sm:gap-3 pb-6 border-b border-gray-200">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded transition-all duration-200 ${
            activeCategory === cat.id
              ? "bg-gray-900 text-white border border-gray-900"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-900"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}
