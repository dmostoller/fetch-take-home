"use client";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { Menu, Search, FolderHeart } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { LogoutButton } from "./logout";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { theme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const isFavoritesPage = pathname === "/favorites";
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo-light.svg");

  useEffect(() => {
    setMounted(true);
    const currentTheme = resolvedTheme || theme;
    setLogoSrc(currentTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg");
  }, [theme, resolvedTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4">
      <div className="max-w-full mx-auto flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src={logoSrc}
              alt="Fetch Logo"
              width={32}
              height={32}
              style={{ width: "auto", height: "32px" }}
            />
          </Link>

          <h1 className="text-lg md:text-xl font-semibold tracking-tight">
            Fetch Finder
          </h1>
        </div>
        {/* Mobile Menu */}
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
            <Drawer.Content
              className="
                fixed 
                z-50 
                bg-background 
                flex 
                flex-col 
                rounded-t-[10px] 
                bottom-0 
                left-0 
                right-0 
                h-[90%] 
                translate-y-0 
                transition-transform 
                duration-300
              "
            >
              <div className="mx-auto w-full max-w-md">
                <div className="p-4 rounded-t-[10px] flex justify-between items-center border-b">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20" />
                  <Drawer.Title className="font-semibold text-lg">
                    Menu
                  </Drawer.Title>
                </div>

                <div className="p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <Link href={isFavoritesPage ? "/browse" : "/favorites"}>
                      <Button variant="ghost" className="w-full justify-start">
                        {!isFavoritesPage ? (
                          <>
                            <FolderHeart className="mr-2 h-4 w-4" />
                            Your Favorites
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Search Dogs
                          </>
                        )}
                      </Button>
                    </Link>
                    <div className="flex items-center w-full border-t p-2 gap-4">
                      <ModeToggle />
                      <LogoutButton />
                    </div>
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link href={isFavoritesPage ? "/browse" : "/favorites"}>
            <Button variant="ghost" className="flex items-center gap-2">
              {isFavoritesPage ? (
                <Search className="h-4 w-4" />
              ) : (
                <FolderHeart className="h-4 w-4" />
              )}
              <span>{isFavoritesPage ? "Search Dogs" : "Your Favorites"}</span>
            </Button>
          </Link>
          <ModeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
