import type { Metadata, Viewport } from "next";
import { Gravitas_One, Inter, Poppins, Syne } from "next/font/google";
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
const gravitasOne = Gravitas_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gravitas-one",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
});
const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${gravitasOne.variable} ${poppins.variable} ${syne.variable} font-sans antialiased relative overflow-x-hidden`}
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
