import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/context/Providers";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FavoritesProvider } from "@/context/FavoritesContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://fetch-take-home-xmeg.vercel.app/"),
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <FavoritesProvider>
              <div className="min-h-screen flex flex-col">{children}</div>
              <Toaster />
            </FavoritesProvider>
          </Providers>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-8GD9Y9BR4V`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8GD9Y9BR4V');
            `}
          </Script>
        </>
      </body>
    </html>
  );
}
