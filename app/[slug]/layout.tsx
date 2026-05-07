import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết bài viết - News Portal",
  description: "Đọc bài viết chi tiết trên News Portal",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
