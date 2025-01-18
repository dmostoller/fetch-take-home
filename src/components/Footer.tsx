"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/fetch-dark.png");

  useEffect(() => {
    setMounted(true);
    const currentTheme = resolvedTheme || theme;
    setLogoSrc(
      currentTheme === "dark" ? "/fetch-light.png" : "/fetch-dark.png",
    );
  }, [theme, resolvedTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <footer className="w-full border-t">
      <div className="max-w-screen-xl mx-auto p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="https://fetch.com" target="_blank">
            <Image
              src={logoSrc}
              alt="Fetch Logo"
              width={100}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Technical Assessment for{" "}
          <Link
            href="https://fetch.com/careers"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            Fetch Rewards
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}{" "}
          <Link
            href="https://www.davidmostoller.com"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            David Mostoller
          </Link>
        </p>
      </div>
    </footer>
  );
}
