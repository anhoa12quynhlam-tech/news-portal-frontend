/**
 * News Service
 * Handles fetching and filtering news data from backend API
 */

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

interface ApiResponse {
  success: boolean;
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
  data: NewsItem;
}

// Backend API URL - Thay đổi nếu backend chạy ở port khác
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Mock data - fallback nếu API không hoạt động
let mockNewsData: NewsItem[] = [];

// Initialize mock data
async function initializeMockData(): Promise<NewsItem[]> {
  if (mockNewsData.length > 0) return mockNewsData;

  try {
    const response = await fetch("/src/data/mockNews.json");
    const data = await response.json();
    mockNewsData = data.news.map((item: any) => ({
      ...item,
      created_at: item.timestamp,
      category_label: item.categoryLabel,
    }));
    return mockNewsData;
  } catch (error) {
    console.error("Failed to load mock news data:", error);
    return [];
  }
}

// Transform API response to match frontend format
function transformApiData(apiItem: any): NewsItem {
  return {
    id: apiItem.id,
    title: apiItem.title,
    description: apiItem.description,
    category: apiItem.category,
    category_label: apiItem.category_label,
    image: apiItem.image,
    images: apiItem.images,
    title_bg_color: apiItem.title_bg_color,
    created_at: apiItem.created_at,
    author: apiItem.author,
  };
}

export async function fetchNews(
  category: string = "all",
  page: number = 1,
  pageSize: number = 6,
): Promise<{ news: NewsItem[]; total: number; hasMore: boolean }> {
  try {
    // Try to fetch from backend API
    let url = `${API_BASE_URL}/api/articles?page=${page}&per_page=${pageSize}`;

    // If category is specified and not "all", use category endpoint
    if (category !== "all") {
      url = `${API_BASE_URL}/api/articles/category/${category}?page=${page}&per_page=${pageSize}`;
    }

    console.log("Fetching from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid API response");
    }

    const transformedNews = data.data.map(transformApiData);

    return {
      news: transformedNews,
      total: data.pagination.total,
      hasMore: data.pagination.has_more,
    };
  } catch (error) {
    console.error(
      "Failed to fetch from backend API, falling back to mock data:",
      error,
    );

    // Fallback to mock data
    const allNews = await initializeMockData();

    // Filter by category
    const filtered =
      category === "all"
        ? allNews
        : allNews.filter((item) => item.category === category);

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNews = filtered.slice(startIndex, endIndex);

    return {
      news: paginatedNews,
      total: filtered.length,
      hasMore: endIndex < filtered.length,
    };
  }
}

export async function fetchNewsDetail(id: number): Promise<NewsItem | null> {
  try {
    // Try to fetch from backend API
    const url = `${API_BASE_URL}/api/articles/${id}`;

    console.log("Fetching detail from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: DetailApiResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid API response");
    }

    return transformApiData(data.data);
  } catch (error) {
    console.error(
      "Failed to fetch detail from backend API, falling back to mock data:",
      error,
    );

    // Fallback to mock data
    const allNews = await initializeMockData();
    const newsItem = allNews.find((item) => item.id === id);

    return newsItem || null;
  }
}

export async function searchNews(
  query: string,
  page: number = 1,
  pageSize: number = 6,
): Promise<{ news: NewsItem[]; total: number; hasMore: boolean }> {
  try {
    // Try to fetch from backend API
    const url = `${API_BASE_URL}/api/articles/search/${encodeURIComponent(query)}?page=${page}&per_page=${pageSize}`;

    console.log("Searching from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid API response");
    }

    const transformedNews = data.data.map(transformApiData);

    return {
      news: transformedNews,
      total: data.pagination.total,
      hasMore: data.pagination.has_more,
    };
  } catch (error) {
    console.error(
      "Failed to search from backend API, falling back to mock data:",
      error,
    );

    // Fallback to mock data
    const allNews = await initializeMockData();
    const lowerQuery = query.toLowerCase();

    // Search in title and description
    const filtered = allNews.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery),
    );

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNews = filtered.slice(startIndex, endIndex);

    return {
      news: paginatedNews,
      total: filtered.length,
      hasMore: endIndex < filtered.length,
    };
  }
}

export const CATEGORIES = [
  { id: "all", label: "Tất Cả" },
  { id: "sports", label: "Thể Thao" },
  { id: "economy", label: "Kinh Tế" },
  { id: "politics", label: "Chính Trị" },
  { id: "society", label: "Xã Hội" },
  { id: "humor", label: "Hài Hước" },
];
