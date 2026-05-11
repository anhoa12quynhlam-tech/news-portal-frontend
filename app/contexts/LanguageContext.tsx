"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "vi" | "en";

type TranslationKey =
  | "chooseLanguageTitle"
  | "chooseLanguageDescription"
  | "vietnamese"
  | "english"
  | "all"
  | "sports"
  | "economy"
  | "politics"
  | "society"
  | "humor"
  | "searchPlaceholder"
  | "searchResultsFor"
  | "foundArticles"
  | "noSearchResults"
  | "noArticles"
  | "advertisementSpace"
  | "back"
  | "backHome"
  | "articleNotFound"
  | "invalidArticleUrl"
  | "articleLoadError"
  | "toggleLanguage"
  | "language"
  | "stayInformed"
  | "contact"
  | "aboutUs"
  | "privacyPolicy"
  | "termsOfService"
  | "hideFooter"
  | "showFooter"
  | "hide"
  | "footer";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  isReady: boolean;
  showLanguageModal: boolean;
  t: (key: TranslationKey) => string;
  locale: string;
};

const STORAGE_KEY = "site_language";

const translations: Record<Language, Record<TranslationKey, string>> = {
  vi: {
    chooseLanguageTitle: "Chọn ngôn ngữ trang web",
    chooseLanguageDescription:
      "Bạn chỉ cần chọn một lần. Hệ thống sẽ ghi nhớ lựa chọn này cho các lần truy cập sau.",
    vietnamese: "Tiếng Việt",
    english: "English",
    all: "Tất Cả",
    sports: "Thể Thao",
    economy: "Kinh Tế",
    politics: "Chính Trị",
    society: "Xã Hội",
    humor: "Hài Hước",
    searchPlaceholder: "Tìm kiếm tin tức...",
    searchResultsFor: "Kết quả tìm kiếm cho:",
    foundArticles: "bài viết",
    noSearchResults: "Không tìm thấy bài viết nào",
    noArticles: "Không có bài viết",
    advertisementSpace: "Khu vực quảng cáo",
    back: "Quay lại",
    backHome: "Quay lại trang chủ",
    articleNotFound: "Không tìm thấy bài viết",
    invalidArticleUrl: "URL bài viết không hợp lệ",
    articleLoadError: "Lỗi khi tải bài viết",
    toggleLanguage: "Đổi ngôn ngữ",
    language: "Ngôn ngữ",
    stayInformed: "News Portal - Luôn cập nhật tin tức",
    contact: "Liên hệ",
    aboutUs: "Về chúng tôi",
    privacyPolicy: "Chính sách bảo mật",
    termsOfService: "Điều khoản dịch vụ",
    hideFooter: "Ẩn footer",
    showFooter: "Hiện footer",
    hide: "Ẩn",
    footer: "Footer",
  },
  en: {
    chooseLanguageTitle: "Choose website language",
    chooseLanguageDescription:
      "You only need to choose once. Your preference will be remembered for future visits.",
    vietnamese: "Tiếng Việt",
    english: "English",
    all: "All",
    sports: "Sports",
    economy: "Economy",
    politics: "Politics",
    society: "Society",
    humor: "Humor",
    searchPlaceholder: "Search news...",
    searchResultsFor: "Search results for:",
    foundArticles: "articles found",
    noSearchResults: "No articles found",
    noArticles: "No articles available",
    advertisementSpace: "Advertisement Space",
    back: "Back",
    backHome: "Back to home",
    articleNotFound: "Article not found",
    invalidArticleUrl: "Invalid article URL",
    articleLoadError: "Error loading article",
    toggleLanguage: "Change language",
    language: "Language",
    stayInformed: "News Portal - Stay Informed",
    contact: "Contact",
    aboutUs: "About Us",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    hideFooter: "Hide footer",
    showFooter: "Show footer",
    hide: "Hide",
    footer: "Footer",
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");
  const [isReady, setIsReady] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY) as Language | null;

    if (storedLanguage === "vi" || storedLanguage === "en") {
      setLanguageState(storedLanguage);
      setShowLanguageModal(false);
    } else {
      setShowLanguageModal(true);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    document.documentElement.lang = language;
  }, [language, isReady]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    setShowLanguageModal(false);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isReady,
      showLanguageModal,
      t: (key: TranslationKey) => translations[language][key],
      locale: language === "vi" ? "vi-VN" : "en-US",
    }),
    [language, isReady, showLanguageModal],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {isReady && showLanguageModal && <LanguageSelectionModal />}
    </LanguageContext.Provider>
  );
}

function LanguageSelectionModal() {
  const { setLanguage, t } = useLanguage();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("chooseLanguageTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {t("chooseLanguageDescription")}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setLanguage("vi")}
            className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-left transition hover:border-blue-500 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900"
          >
            <span className="block text-lg font-semibold text-blue-700 dark:text-blue-300">
              Tiếng Việt
            </span>
            <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400">
              Giao diện và tin tức tiếng Việt
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage("en")}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-left transition hover:border-emerald-500 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900"
          >
            <span className="block text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              English
            </span>
            <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400">
              English interface and articles
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
