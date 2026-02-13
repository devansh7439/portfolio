import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ParticleGrid from "@/components/ParticleGrid";
import ScrollRestoration from "@/components/ScrollRestoration";
import PageWrapper from "@/components/PageWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeWrapper from "@/components/ThemeWrapper";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Devansh Bagaria | Creative Developer",
  description: "Portfolio of Devansh Bagaria - A creative developer specializing in building exceptional digital experiences through design and engineering.",
  keywords: ["creative developer", "portfolio", "web developer", "frontend", "react", "next.js", "framer motion"],
  authors: [{ name: "Devansh Bagaria" }],
  openGraph: {
    title: "Devansh Bagaria | Creative Developer",
    description: "Portfolio of Devansh Bagaria - Building digital experiences that bridge design and engineering.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased relative overflow-x-hidden`}
        suppressHydrationWarning
      >
        <style dangerouslySetInnerHTML={{ __html: `
          ::-webkit-scrollbar {
            display: none !important;
            width: 0px !important;
            background: transparent !important;
          }
          html {
            scrollbar-width: none !important;
          }
        `}} />
        <ThemeProvider>
          <ThemeWrapper>
            <PageWrapper>
              <ScrollRestoration />
              <ParticleGrid />
              
              <div className="relative z-10">
                <Navbar/>
                {children}
              </div>
            </PageWrapper>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
