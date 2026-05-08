import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Suspense } from "react";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "News Portal - Latest News & Updates",
  description:
    "Stay informed with the latest news from around the world. Breaking news, sports, business, politics, and more.",
  keywords:
    "news, breaking news, latest news, world news, sports, business, politics",
  openGraph: {
    title: "News Portal - Latest News & Updates",
    description: "Stay informed with the latest news from around the world",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "News Portal",
    description: "Latest news and updates",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="light" switchable={true}>
            <TooltipProvider>
              <Toaster />
              <Suspense fallback={null}>
                <Header />
              </Suspense>
              {children}
              <Footer />
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
