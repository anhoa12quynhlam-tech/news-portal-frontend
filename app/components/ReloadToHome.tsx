"use client";

import { useEffect } from "react";

export default function ReloadToHome() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    const isReload = navigationEntry?.type === "reload";

    const isHomeUrl =
      window.location.pathname === "/" && window.location.search === "";

    if (isReload && !isHomeUrl) {
      window.location.replace("/");
    }
  }, []);

  return null;
}
