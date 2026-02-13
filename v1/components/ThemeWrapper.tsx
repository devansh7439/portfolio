'use client';

import { useTheme } from "./ThemeProvider";

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#121212] text-white' : 'bg-[#fafafa] text-gray-900'
    }`}>
      {children}
    </div>
  );
}
