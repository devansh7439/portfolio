"use client";

import { useEffect } from "react";

export default function ScrollRestoration() {
  useEffect(() => {
    const STORAGE_KEY = "scroll-position";

    // Restore scroll position on load (instant, no animation)
    const savedPosition = sessionStorage.getItem(STORAGE_KEY);
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);
      // Use instant scroll to prevent jumping
      window.scrollTo(x, y);
      sessionStorage.removeItem(STORAGE_KEY);
    }

    // Save scroll position before unload
    const handleBeforeUnload = () => {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}
