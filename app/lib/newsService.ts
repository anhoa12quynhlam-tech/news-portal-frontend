/**
 * News Service
 * Handles fetching and filtering news data from backend API
 */

import { NewsItem } from "../../types/news";

export type Language = "vi" | "en";

interface ApiResponse {
  success: boolean;
  language?: Language;
  data: NewsItem[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
  };
}

interface DetailApiResponse {
  success: boolean;
  language?: Language;
  data: NewsItem;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let mockNewsData: NewsItem[] = [];

async function initializeMockData(): Promise<NewsItem[]> {
  if (mockNewsData.length > 0) return mockNewsData;

  try {
    const response = await fetch("/src/data/mockNews.json");
    const data = await response.json();
    mockNewsData = data.news.map((item: any) => ({
      ...item,
      created_at: item.timestamp,
      category_label: item.categoryLabel,
      title_vi: item.title,
      description_vi: item.description,
      category_label_vi: item.categoryLabel,
    }));
    return mockNewsData;
  } catch (error) {
    console.error("Failed to load mock news data:", error);
    return [];
  }
}

function localizeApiItem(apiItem: any, language: Language): NewsItem {
  const isEnglish = language === "en";

  return {
    id: apiItem.id,
    title: isEnglish ? apiItem.title_en || apiItem.title : apiItem.title_vi || apiItem.title,
    description: isEnglish
      ? apiItem.description_en || apiItem.description
      : apiItem.description_vi || apiItem.description,
    category: apiItem.category,
    category_label: isEnglish
      ? apiItem.category_label_en || apiItem.category_label
      : apiItem.category_label_vi || apiItem.category_label,
    title_vi: apiItem.title_vi || apiItem.title,
    title_en: apiItem.title_en,
    description_vi: apiItem.description_vi || apiItem.description,
    description_en: apiItem.description_en,
    category_label_vi: apiItem.category_label_vi || apiItem.category_label,
    category_label_en: apiItem.category_label_en,
    image: apiItem.image,
    images: apiItem.images,
    title_bg_color: apiItem.title_bg_color,
    created_at: apiItem.created_at,
    updated_at: apiItem.updated_at,
    author: apiItem.author,
  };
}

function withLanguage(url: string, language: Language): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}lang=${language}`;
}

export async function fetchNews(
  category: string = "all",
  page: number = 1,
  pageSize: number = 6,
  language: Language = "vi",
): Promise<{ news: NewsItem[]; total: number; hasMore: boolean }> {
  try {
    let url = `${API_BASE_URL}/api/articles?page=${page}&per_page=${pageSize}`;

    if (category !== "all") {
      url = `${API_BASE_URL}/api/articles/category/${category}?page=${page}&per_page=${pageSize}`;
    }

    const response = await fetch(withLanguage(url, language));

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid API response");
    }

    const transformedNews = data.data.map((item) => localizeApiItem(item, language));

    return {
      news: transformedNews,
      total: data.pagination.total,
      hasMore: data.pagination.has_more,
    };
  } catch (error) {
    console.error("Failed to fetch from backend API, falling back to mock data:", error);

    const allNews = await initializeMockData();
    const filtered =
      category === "all" ? allNews : allNews.filter((item) => item.category === category);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNews = filtered.slice(startIndex, endIndex).map((item) =>
      localizeApiItem(item, language),
    );

    return {
      news: paginatedNews,
      total: filtered.length,
      hasMore: endIndex < filtered.length,
    };
  }
}

export async function fetchNewsDetail(
  id: number,
  language: Language = "vi",
): Promise<NewsItem | null> {
  try {
    const url = withLanguage(`${API_BASE_URL}/api/articles/${id}`, language);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: DetailApiResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid API response");
    }

    return localizeApiItem(data.data, language);
  } catch (error) {
    console.error("Failed to fetch detail from backend API, falling back to mock data:", error);

    const allNews = await initializeMockData();
    const newsItem = allNews.find((item) => item.id === id);

    return newsItem ? localizeApiItem(newsItem, language) : null;
  }
}

export async function searchNews(
  query: string,
  page: number = 1,
  pageSize: number = 6,
  language: Language = "vi",
): Promise<{ news: NewsItem[]; total: number; hasMore: boolean }> {
  try {
    const url = withLanguage(
      `${API_BASE_URL}/api/articles/search/${encodeURIComponent(query)}?page=${page}&per_page=${pageSize}`,
      language,
    );

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid API response");
    }

    const transformedNews = data.data.map((item) => localizeApiItem(item, language));

    return {
      news: transformedNews,
      total: data.pagination.total,
      hasMore: data.pagination.has_more,
    };
  } catch (error) {
    console.error("Failed to search from backend API, falling back to mock data:", error);

    const allNews = await initializeMockData();
    const lowerQuery = query.toLowerCase();

    const filtered = allNews.filter((item) => {
      const localizedItem = localizeApiItem(item, language);
      return (
        localizedItem.title.toLowerCase().includes(lowerQuery) ||
        localizedItem.description.toLowerCase().includes(lowerQuery)
      );
    });

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNews = filtered
      .slice(startIndex, endIndex)
      .map((item) => localizeApiItem(item, language));

    return {
      news: paginatedNews,
      total: filtered.length,
      hasMore: endIndex < filtered.length,
    };
  }
}

export const CATEGORY_IDS = ["all", "sports", "economy", "politics", "society", "humor"] as const;
