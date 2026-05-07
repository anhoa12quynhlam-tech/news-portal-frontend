"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { fetchNewsDetail } from "@/lib/newsService";
import { extractIdFromSlug } from "@/lib/slug";
import ImageGallery from "@/components/ImageGallery";
import LoadingCard from "@/components/LoadingCard";
import Link from "next/link";

interface NewsItem {
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

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const loadNewsDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Extract ID from slug (format: "title-slug-123")
        const id = extractIdFromSlug(slug as string);
        
        if (!id) {
          setError("Invalid article URL");
          return;
        }

        const result = await fetchNewsDetail(id);

        if (!result) {
          setError("Không tìm thấy bài viết");
          return;
        }

        setNews(result);
      } catch (err) {
        console.error("Error loading news detail:", err);
        setError("Lỗi khi tải bài viết");
      } finally {
        setIsLoading(false);
      }
    };

    loadNewsDetail();
  }, [slug]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-950">
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-950">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-600 dark:text-red-400 mb-4">
              {error || "Không tìm thấy bài viết"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Quay lại trang chủ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Category color mapping
  const categoryColors: Record<string, string> = {
    sports: "#ef4444",
    economy: "#10b981",
    politics: "#a855f7",
    society: "#3b82f6",
    humor: "#f59e0b",
  };

  const bgColor = news.title_bg_color || categoryColors[news.category] || "#ef4444";

  // Prepare images array
  const imagesList: string[] = [];
  if (news.image) {
    imagesList.push(news.image);
  }
  if (news.images && news.images.length > 0) {
    imagesList.push(...news.images);
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Quay lại</span>
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span className="text-gray-600 dark:text-gray-400">{news.category_label}</span>
        </div>

        {/* Article Container */}
        <article className="max-w-3xl mx-auto">
          {/* Title Section - Colored Background */}
          <div
            className="px-6 sm:px-8 py-8 sm:py-10 text-white rounded-lg mb-8"
            style={{ backgroundColor: bgColor }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              {news.title}
            </h1>

            {/* Category Badge */}
            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
              {news.category_label}
            </div>

            {/* Meta Information */}
            <div className="flex flex-col gap-3 text-sm text-white/90 mt-6">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">{news.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(news.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Images Gallery */}
          {imagesList.length > 0 && (
            <div className="mb-8">
              <ImageGallery images={imagesList} title={news.title} />
            </div>
          )}

          {/* Description/Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {news.description}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-8" />

            {/* Footer Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Tag size={18} />
                <span>{news.category_label}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                ID: {news.id}
              </div>
            </div>
          </div>

          {/* Related Actions */}
          <div className="mt-8 flex gap-4 justify-center sm:justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <ArrowLeft size={20} />
              Quay lại trang chủ
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
