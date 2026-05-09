// app/components/ReloadToHome.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ReloadToHome() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    const isReload = navigationEntry?.type === "reload";
    const hasSearchParams = searchParams.toString().length > 0;
    const isHomeUrl = pathname === "/" && !hasSearchParams;

    if (isReload && !isHomeUrl) {
      window.location.replace("/");
    }
  }, [pathname, searchParams]);

  return null;
}
