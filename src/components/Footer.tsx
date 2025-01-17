"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Github } from "lucide-react";

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
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-full mx-auto py-4 px-8">
        <div className="flex flex-col sm:flex-row items-start gap-6 pr-24">
          <div className="flex-shrink-0">
            <Link
              href="https://fetch.com"
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src={logoSrc}
                alt="Fetch Logo"
                width={100}
                height={40}
                style={{ width: "100px", height: "40px" }}
                className="object-contain"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-1 ">
            <p className="text-sm text-muted-foreground">
              Technical Assessment for{" "}
              <Link
                href="https://fetch.com"
                target="_blank"
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Fetch Rewards
              </Link>
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>&copy; {new Date().getFullYear()}</span>
              <span>•</span>
              <Link
                href="https://www.davidmostoller.com"
                target="_blank"
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                David Mostoller
              </Link>
              <Link
                href="https://github.com/dmostoller/fetch-take-home"
                target="_blank"
                className="ml-2 p-1.5 rounded-md hover:bg-secondary transition-all duration-300 hover:scale-110"
                aria-label="View project on GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
