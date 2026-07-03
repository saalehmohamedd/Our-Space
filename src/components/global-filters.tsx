// src/components/global-filters.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Filter,
  X,
  Star,
  Heart,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowUpDown,
  ListFilter,
} from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface GlobalFiltersProps {
  filters?: {
    status?: FilterOption[];
    sort?: FilterOption[];
    date?: FilterOption[];
    type?: FilterOption[];
    filter?: FilterOption[];  // Add this line
  };
  className?: string;
}

export function GlobalFilters({ filters, className }: GlobalFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort");
  const currentFilter = searchParams.get("filter");

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentSort || currentFilter;

  // Default filters that work for all pages
  const defaultFilters = {
    sort: [
      { label: "Newest", value: "newest", icon: <Clock className="h-3 w-3" /> },
      { label: "Oldest", value: "oldest", icon: <Calendar className="h-3 w-3" /> },
      { label: "A-Z", value: "az", icon: <ArrowUpDown className="h-3 w-3" /> },
      { label: "Z-A", value: "za", icon: <ArrowUpDown className="h-3 w-3" /> },
    ],
    filter: [
      { label: "All", value: "all", icon: <ListFilter className="h-3 w-3" /> },
      { label: "Favorites", value: "favorites", icon: <Heart className="h-3 w-3" /> },
      { label: "Active", value: "active", icon: <CheckCircle2 className="h-3 w-3" /> },
      { label: "Completed", value: "completed", icon: <Star className="h-3 w-3" /> },
    ],
  };

  const activeFilters = filters || defaultFilters;

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      
      {/* Sort Filters */}
      {activeFilters.sort && (
        <div className="flex items-center gap-1 flex-wrap">
          {activeFilters.sort.map((option) => (
            <Badge
              key={option.value}
              variant={currentSort === option.value ? "default" : "outline"}
              className={`cursor-pointer transition-all text-xs ${
                currentSort === option.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted"
              }`}
              onClick={() => setParam("sort", currentSort === option.value ? null : option.value)}
            >
              {option.icon}
              <span className="ml-1">{option.label}</span>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Options */}
      {activeFilters.filter && (
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs text-muted-foreground mx-1">•</span>
          {activeFilters.filter.map((option) => (
            <Badge
              key={option.value}
              variant={currentFilter === option.value ? "default" : "outline"}
              className={`cursor-pointer transition-all text-xs ${
                currentFilter === option.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted"
              }`}
              onClick={() => setParam("filter", currentFilter === option.value ? null : option.value)}
            >
              {option.icon}
              <span className="ml-1">{option.label}</span>
            </Badge>
          ))}
        </div>
      )}

      {/* Clear All */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-destructive flex-shrink-0"
          onClick={clearAll}
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}