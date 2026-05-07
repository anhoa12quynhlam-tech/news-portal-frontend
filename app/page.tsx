"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import LoadingCard from "@/components/LoadingCard";
import { fetchNews, searchNews } from "@/lib/newsService";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  category_label: string;
  image: string;
  images?: string[];
  title_bg_color?: string;
  created_at: string;
  author: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    setMounted(true);
    const categoryParam = searchParams.get("category") || "all";
    const searchParam = searchParams.get("search") || "";

    if (searchParam) {
      setSearchQuery(searchParam);
      setIsSearching(true);
      setActiveCategory("all");
      setNews([]);
      setPage(1);
      setIsInitialLoading(true);
      loadSearch(searchParam, 1);
    } else {
      setActiveCategory(categoryParam);
      setNews([]);
      setPage(1);
      setIsInitialLoading(true);
      loadNews(1, categoryParam);
    }
  }, []); // Only run once on mount

  // Listen to URL parameters changes
  useEffect(() => {
    if (!mounted) return;

    const categoryParam = searchParams.get("category") || "all";
    const searchParam = searchParams.get("search") || "";

    if (searchParam) {
      if (searchParam !== searchQuery) {
        setSearchQuery(searchParam);
        setIsSearching(true);
        setActiveCategory("all");
        setNews([]);
        setPage(1);
        setIsInitialLoading(true);
        loadSearch(searchParam, 1);
      }
    } else {
      if (categoryParam !== activeCategory) {
        setActiveCategory(categoryParam);
        setSearchQuery("");
        setIsSearching(false);
        setNews([]);
        setPage(1);
        setIsInitialLoading(true);
        loadNews(1, categoryParam);
      }
    }
  }, [searchParams, mounted]);

  // Load news function
  const loadNews = async (pageNum: number, category: string) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await fetchNews(category, pageNum, 6);
      console.log("RESULT:", result);

      if (!result || !Array.isArray(result.news)) {
        console.error("Invalid API response:", result);
        setHasMore(false);
        return;
      }

      if (pageNum === 1) {
        setNews(result.news);
      } else {
        setNews((prev) => [...prev, ...result.news]);
      }

      setPage(pageNum);
      setHasMore(!!result.hasMore);
    } catch (error) {
      console.error("Error loading news:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Search news function
  const loadSearch = async (query: string, pageNum: number) => {
    if (isLoading || !query.trim()) return;

    setIsLoading(true);
    try {
      const result = await searchNews(query, pageNum, 6);
      console.log("SEARCH RESULT:", result);

      if (!result || !Array.isArray(result.news)) {
        console.error("Invalid search response:", result);
        setHasMore(false);
        return;
      }

      if (pageNum === 1) {
        setNews(result.news);
      } else {
        setNews((prev) => [...prev, ...result.news]);
      }

      setPage(pageNum);
      setHasMore(!!result.hasMore);
    } catch (error) {
      console.error("Error searching news:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Infinite scroll - memoized callback
  const handleLoadMore = useCallback(() => {
    console.log("Load more triggered", { isLoading, hasMore, page });
    if (!isLoading && hasMore) {
      if (isSearching) {
        loadSearch(searchQuery, page + 1);
      } else {
        loadNews(page + 1, activeCategory);
      }
    }
  }, [isLoading, hasMore, page, isSearching, searchQuery, activeCategory]);

  const { setObserverTarget } = useInfiniteScroll(handleLoadMore);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-950">
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="hidden lg:block">
              <div className="sticky top-20 bg-muted rounded-lg p-4 h-96 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Advertisement Space
                </p>
              </div>
            </div>

            <div>
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-20 bg-muted rounded-lg p-4 h-96 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Advertisement Space
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <main className="container mx-auto px-4 py-8">
        {/* Search Results Header */}
        {isSearching && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Kết quả tìm kiếm cho: <span className="font-semibold">"{searchQuery}"</span>
              {news.length > 0 && <span> - Tìm thấy {news.length} bài viết</span>}
            </p>
          </div>
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Ads */}
          <div className="hidden lg:block">
            <div className="sticky top-20 bg-muted rounded-lg p-4 h-96 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Advertisement Space
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {isInitialLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isSearching ? "Không tìm thấy bài viết nào" : "Không có bài viết"}
                </p>
              </div>
            ) : (
              <div>
                {news.map((item) => (
                  <NewsCard key={item.id} {...item} />
                ))}

                {/* Loading more */}
                {isLoading && (
                  <div>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="mb-8">
                        <LoadingCard />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={setObserverTarget} className="h-4" />
          </div>

          {/* Right Ads */}
          <div className="hidden lg:block">
            <div className="sticky top-20 bg-muted rounded-lg p-4 h-96 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Advertisement Space
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
