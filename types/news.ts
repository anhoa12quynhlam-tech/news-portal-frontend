export interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  category_label: string;
  title_vi?: string;
  title_en?: string;
  description_vi?: string;
  description_en?: string;
  category_label_vi?: string;
  category_label_en?: string;
  image?: string;
  images?: string[];
  title_bg_color?: string;
  created_at: string;
  updated_at?: string;
  author: string;
}
