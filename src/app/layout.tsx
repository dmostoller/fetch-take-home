import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/context/Providers";
import "./globals.css";
import { FavoritesProvider } from "@/context/FavoritesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fetch Finder | Technical Assessment",
  description:
    "A demo application built for Fetch's Frontend Engineering technical assessment. Features include dog shelter search, breed filtering, favoriting, and match generation.",
  keywords: [
    "Fetch",
    "Technical Assessment",
    "Demo",
    "Dog Shelter",
    "Pet Adoption",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "David Mostoller", url: "https://www.davidmostoller.com" }],
  creator: "David Mostoller",
  openGraph: {
    type: "website",
    title: "Fetch Finder | Technical Assessment",
    description:
      "Demo application for Fetch's Frontend Engineering position - A dog adoption platform prototype.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fetch Finder | Technical Assessment",
    description:
      "Demo application for Fetch's Frontend Engineering position - A dog adoption platform prototype.",
    images: ["/og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <FavoritesProvider>
              <main>{children}</main>
              <Toaster />
            </FavoritesProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
