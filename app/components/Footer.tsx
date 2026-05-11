"use client";

import { useState, useEffect } from "react";
import { ChevronUp, Share2, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  // Ensure component only renders on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const socialLinks = [
    {
      name: "Facebook",
      icon: Share2,
      url: "https://facebook.com",
      color: "hover:text-blue-600 dark:hover:text-blue-400",
    },
    {
      name: "Zalo",
      icon: MessageCircle,
      url: "https://zalo.me",
      color: "hover:text-cyan-500 dark:hover:text-cyan-400",
    },
    {
      name: "X (Twitter)",
      icon: Send,
      url: "https://twitter.com",
      color: "hover:text-gray-700 dark:hover:text-gray-300",
    },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Footer */}
      <footer
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isExpanded ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Footer Content */}
          <div className="py-6 space-y-4">
            {/* Top Row - Logo, Contact, Social */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Logo & Copyright */}
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    © 2026 qHAL Studio
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("stayInformed")}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{t("contact")}:</span>
                </p>
                <a
                  href="mailto:anhoa12quynhlam@gmail.com"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                >
                  anhoa12quynhlam@gmail.com
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className={`text-gray-600 dark:text-gray-400 transition-colors ${social.color}`}
                    >
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />

            {/* Bottom Row - Links & Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Footer Links */}
              <div className="flex flex-wrap gap-4 text-xs">
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t("aboutUs")}
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t("termsOfService")}
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t("contact")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toggle Button - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-4 right-4 z-50 flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
          isExpanded
            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        }`}
        aria-label={isExpanded ? t("hideFooter") : t("showFooter")}
        title={isExpanded ? t("hideFooter") : t("showFooter")}
      >
        <ChevronUp
          size={20}
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-0" : "rotate-180"
          }`}
        />
        <span className="text-sm">{isExpanded ? t("hide") : t("footer")}</span>
      </button>

      {/* Spacer - để tránh content bị che bởi footer */}
      {isExpanded && <div className="h-40 sm:h-32" />}
    </>
  );
}
