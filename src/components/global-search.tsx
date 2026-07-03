// src/components/global-search.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  Gift,
  MapPin,
  Calendar,
  Mail,
  FileText,
  Music,
  Tv,
  Bell,
  Trophy,
  ShoppingBag,
  Sparkles,
  Clock,
  Command,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const searchConfig = [
  { type: "memories", label: "Memories", icon: <Heart className="h-4 w-4" />, color: "text-rose-500", href: "/memories" },
  { type: "wishlist", label: "Wishlist", icon: <Gift className="h-4 w-4" />, color: "text-indigo-500", href: "/wishlist" },
  { type: "shopping", label: "Shopping", icon: <ShoppingBag className="h-4 w-4" />, color: "text-emerald-500", href: "/shopping" },
  { type: "places", label: "Travel", icon: <MapPin className="h-4 w-4" />, color: "text-emerald-500", href: "/travil-places" },
  { type: "dates", label: "Dates", icon: <Calendar className="h-4 w-4" />, color: "text-rose-500", href: "/dates" },
  { type: "letters", label: "Letters", icon: <Mail className="h-4 w-4" />, color: "text-rose-500", href: "/letters" },
  { type: "notes", label: "Notes", icon: <FileText className="h-4 w-4" />, color: "text-amber-500", href: "/notes" },
  { type: "playlists", label: "Playlists", icon: <Music className="h-4 w-4" />, color: "text-violet-500", href: "/playlists" },
  { type: "watchlist", label: "Watchlist", icon: <Tv className="h-4 w-4" />, color: "text-indigo-500", href: "/watchlist" },
  { type: "reminders", label: "Reminders", icon: <Bell className="h-4 w-4" />, color: "text-amber-500", href: "/reminders" },
  { type: "achievements", label: "Achievements", icon: <Trophy className="h-4 w-4" />, color: "text-amber-500", href: "/achievements" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Search function
  const handleSearch = async (value: string) => {
    setQuery(value);
    setSelectedIndex(0);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    // Fetch results from API
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      router.push(results[selectedIndex].href);
      setOpen(false);
      setQuery("");
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg border transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-muted rounded border font-mono">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-[600px] p-0 gap-0 border-0 shadow-2xl rounded-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search everything..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 h-auto"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  inputRef.current?.focus();
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs bg-muted rounded border font-mono text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {query && results.length === 0 ? (
              <div className="p-8 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              </div>
            ) : !query ? (
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {searchConfig.map((config) => (
                    <button
                      key={config.type}
                      onClick={() => {
                        router.push(config.href);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <span className={config.color}>{config.icon}</span>
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-4">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                      index === selectedIndex
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${result.color}`}>
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {result.type}
                    </Badge>
                    {index === selectedIndex && (
                      <span className="text-xs text-muted-foreground">↵</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded border font-mono">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded border font-mono">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded border font-mono">ESC</kbd> Close
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}