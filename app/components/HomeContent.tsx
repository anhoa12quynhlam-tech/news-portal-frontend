"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import LoadingCard from "@/components/LoadingCard";
import { fetchNews, searchNews } from "@/lib/newsService";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { NewsItem } from "../../types/news";

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
  const requestIdRef = useRef(0);

  // Mark mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep UI state strictly in sync with URL parameters.
  useEffect(() => {
    if (!mounted) return;

    const categoryParam = searchParams.get("category") || "all";
    const searchParam = searchParams.get("search") || "";

    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    setNews([]);
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true);

    if (searchParam.trim()) {
      setSearchQuery(searchParam);
      setIsSearching(true);
      setActiveCategory("all");
      loadSearch(searchParam, 1, requestId);
    } else {
      setSearchQuery("");
      setIsSearching(false);
      setActiveCategory(categoryParam);
      loadNews(1, categoryParam, requestId);
    }
  }, [searchParams, mounted]);

  // Load news function
  const loadNews = async (
    pageNum: number,
    category: string,
    requestId?: number,
  ) => {
    if (isLoading && pageNum !== 1) return;

    setIsLoading(true);
    try {
      const result = await fetchNews(category, pageNum, 6);
      if (requestId && requestId !== requestIdRef.current) return;

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
  const loadSearch = async (
    query: string,
    pageNum: number,
    requestId?: number,
  ) => {
    if ((isLoading && pageNum !== 1) || !query.trim()) return;

    setIsLoading(true);
    try {
      const result = await searchNews(query, pageNum, 6);
      if (requestId && requestId !== requestIdRef.current) return;

      if (!result || !Array.isArray(result.news)) {
        console.error("Invalid search response:", result);
        setHasMore(false);
        return;
      }

      if (pageNum === 1) {
        const cleanNews: NewsItem[] = result.news.map((item: NewsItem) => ({
          ...item,
          image: item.image ?? "/placeholder.jpg",
        }));

        setNews(cleanNews);
      } else {
        const cleanNews: NewsItem[] = result.news.map((item: NewsItem) => ({
          ...item,
          image: item.image ?? "/placeholder.jpg",
        }));
        setNews((prev) => [...prev, ...cleanNews]);
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
              Kết quả tìm kiếm cho:{" "}
              <span className="font-semibold">"{searchQuery}"</span>
              {news.length > 0 && (
                <span> - Tìm thấy {news.length} bài viết</span>
              )}
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
                  {isSearching
                    ? "Không tìm thấy bài viết nào"
                    : "Không có bài viết"}
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
