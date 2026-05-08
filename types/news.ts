export interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  category_label: string;
  image?: string;
  images?: string[];
  title_bg_color?: string;
  created_at: string;
  author: string;
}
