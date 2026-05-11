"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, X, Search, Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
}

export default function Header({
  onSearchChange,
  onCategoryChange,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { theme, toggleTheme, switchable } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = currentSearch
    ? ""
    : searchParams.get("category") || "all";

  const navigationItems = [
    { id: "all", label: t("all") },
    { id: "sports", label: t("sports") },
    { id: "economy", label: t("economy") },
    { id: "politics", label: t("politics") },
    { id: "society", label: t("society") },
    { id: "humor", label: t("humor") },
  ];

  const getCategoryHref = (categoryId: string) => {
    return categoryId === "all" ? "/" : `/?category=${categoryId}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    setIsMenuOpen(false);

    if (onSearchChange) {
      onSearchChange(trimmedQuery);
    }

    router.push(`/?search=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (categoryId: string) => {
    setIsMenuOpen(false);
    setSearchQuery("");

    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    setIsMenuOpen(false);

    if (onCategoryChange) {
      onCategoryChange("all");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={handleLogoClick}
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <span className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
              News Portal
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:px-3"
              aria-label={t("toggleLanguage")}
              type="button"
              title={t("toggleLanguage")}
            >
              <Languages size={18} />
              <span>{language.toUpperCase()}</span>
            </button>

            {switchable && toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
                type="button"
              >
                {theme === "light" ? (
                  <Moon
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                ) : (
                  <Sun size={20} className="text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
              type="button"
            >
              {isMenuOpen ? (
                <X size={24} className="text-gray-900 dark:text-white" />
              ) : (
                <Menu size={24} className="text-gray-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 pb-0 overflow-x-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={getCategoryHref(item.id)}
              onClick={() => handleCategoryClick(item.id)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                currentCategory === item.id
                  ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                  : "text-gray-700 dark:text-gray-300 border-transparent hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800 mt-4">
            <form onSubmit={handleSearch} className="mb-4 pt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={getCategoryHref(item.id)}
                  onClick={() => handleCategoryClick(item.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors text-left ${
                    currentCategory === item.id
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
