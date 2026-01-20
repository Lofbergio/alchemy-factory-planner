"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Sparkles, Calculator, Package, Cog, BookOpen } from "lucide-react";
import { AlchemyIcon } from "@/components/icons/AlchemyIcon";
import { FeedbackButton } from "@/components/ui/FeedbackButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const codexLinks = [
  { href: "/items", label: "Items", icon: Package },
  { href: "/devices", label: "Devices", icon: Cog, comingSoon: true },
  { href: "/recipes", label: "Recipes", icon: BookOpen, comingSoon: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  // Track which pathname the dropdown was opened for - automatically closes on route change
  const [openForPathname, setOpenForPathname] = useState<string | null>(null);
  const codexOpen = openForPathname === pathname;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setCodexOpen = (open: boolean) => {
    setOpenForPathname(open ? pathname : null);
  };

  const isCalculator = pathname === "/";
  const isCodexActive =
    pathname.startsWith("/items") ||
    pathname.startsWith("/devices") ||
    pathname.startsWith("/recipes");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenForPathname(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[var(--background)] text-[var(--text-primary)] p-2 lg:p-8 pb-4 lg:pb-6 bg-arcane-pattern">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-5 flex-1">
          {/* Mystical logo container */}
          <Link href="/" className="relative group">
            {/* Outer glow ring */}
            <div className="absolute -inset-2 bg-gradient-to-br from-[var(--accent-gold)]/20 via-[var(--accent-purple)]/10 to-transparent rounded-full blur-md group-hover:from-[var(--accent-gold)]/30 transition-all"></div>

            {/* Main icon container */}
            <div className="relative p-3 bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface)] rounded-xl border border-[var(--accent-gold-dim)]/50 glow-gold">
              {/* Corner accents */}
              <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-[var(--accent-gold)] rounded-tl-lg"></div>
              <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-[var(--accent-gold)] rounded-tr-lg"></div>
              <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-[var(--accent-gold)] rounded-bl-lg"></div>
              <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-[var(--accent-gold)] rounded-br-lg"></div>

              <AlchemyIcon className="w-9 h-9 text-[var(--accent-gold)]" />
            </div>
          </Link>

          {/* Title section */}
          <div className="relative">
            {/* Decorative line above title */}
            <div className="absolute -top-2 left-0 right-0 h-[1px] bg-gradient-to-r from-[var(--accent-gold-dim)] via-[var(--accent-gold)]/50 to-transparent"></div>

            <div className="flex items-center gap-2">
              <Link href="/">
                <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-cinzel)] text-gradient-gold tracking-wide hover:opacity-90 transition-opacity">
                  Alchemy Factory Tools
                </h1>
              </Link>
              <Sparkles className="w-4 h-4 text-[var(--accent-purple)] opacity-60 hidden md:block" />
            </div>

            <div className="hidden md:flex items-center gap-3 mt-1">
              <div className="w-8 h-[1px] bg-gradient-to-r from-[var(--accent-gold-dim)] to-transparent"></div>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                {isCalculator ? "Calculator" : isCodexActive ? "Codex" : "Tools"}
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-[var(--accent-gold-dim)] to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <FeedbackButton />
        </div>
      </div>

      {/* Navigation - styled bar below header */}
      <nav className="mt-4 relative">
        {/* Decorative lines */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[var(--border)] to-transparent"></div>

        <div className="relative flex items-center justify-center gap-2 md:gap-4">
          {/* Calculator Link */}
          <Link
            href="/"
            className={cn(
              "relative flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium uppercase tracking-wider transition-all",
              "bg-[var(--surface)] border",
              isCalculator
                ? "text-[var(--accent-gold)] border-[var(--accent-gold-dim)] shadow-[0_0_12px_rgba(var(--accent-gold-rgb),0.15)]"
                : "text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold-dim)]/50"
            )}
          >
            {isCalculator && (
              <>
                <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-[var(--accent-gold)] rounded-tl"></div>
                <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-[var(--accent-gold)] rounded-tr"></div>
                <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-[var(--accent-gold)] rounded-bl"></div>
                <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-[var(--accent-gold)] rounded-br"></div>
              </>
            )}
            <Calculator className="w-4 h-4" />
            <span>Calculator</span>
          </Link>

          {/* Decorative separator */}
          <div className="hidden sm:flex items-center gap-1 text-[var(--accent-gold-dim)]">
            <div className="w-1 h-1 rounded-full bg-current"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            <div className="w-1 h-1 rounded-full bg-current"></div>
          </div>

          {/* Codex Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCodexOpen(!codexOpen)}
              className={cn(
                "relative flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium uppercase tracking-wider transition-all",
                "bg-[var(--surface)] border",
                isCodexActive
                  ? "text-[var(--accent-gold)] border-[var(--accent-gold-dim)] shadow-[0_0_12px_rgba(var(--accent-gold-rgb),0.15)]"
                  : "text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold-dim)]/50"
              )}
            >
              {isCodexActive && (
                <>
                  <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-[var(--accent-gold)] rounded-tl"></div>
                  <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-[var(--accent-gold)] rounded-tr"></div>
                  <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-[var(--accent-gold)] rounded-bl"></div>
                  <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-[var(--accent-gold)] rounded-br"></div>
                </>
              )}
              <BookOpen className="w-4 h-4" />
              <span>Codex</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  codexOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {codexOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl shadow-xl py-2 z-50 overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-gold-dim)] to-transparent"></div>

                {codexLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.comingSoon ? "#" : link.href}
                    onClick={(e) => {
                      if (link.comingSoon) e.preventDefault();
                      else setCodexOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm normal-case tracking-normal transition-all",
                      link.comingSoon
                        ? "text-[var(--text-muted)] cursor-not-allowed"
                        : pathname.startsWith(link.href)
                        ? "text-[var(--accent-gold)] bg-[var(--accent-gold)]/10"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                    {link.comingSoon && (
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
