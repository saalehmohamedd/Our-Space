// components/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { navigationItems } from "@/lib/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Partner {
  name?: string | null;
  avatarUrl?: string | null;
}

interface AppSidebarProps {
  partnerA?: Partner;
  partnerB?: Partner;
  defaultOpen?: boolean;
}

export function AppSidebar({
  partnerA,
  partnerB,
  defaultOpen = true,
}: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const pathname = usePathname();

  const NavLinks = () => (
    <div className="space-y-1">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              isActive 
                ? "bg-white-100" 
                : "text-muted-foreground",
              !isOpen && "justify-center px-2"
            )}
            title={!isOpen ? item.name : undefined}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {isOpen && <span>{item.name}</span>}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header with Toggle */}
      <div
        className={cn(
          "flex h-16 items-center border-b",
          isOpen ? "px-6 justify-between" : "px-2 justify-center"
        )}
      >
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500 fill-current flex-shrink-0" />
          {isOpen && (
            <span className="font-semibold tracking-tight">Our Space</span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <NavLinks />
      </ScrollArea>

      {/* Footer with Partners */}
      <div className={cn("p-4 border-t bg-muted/30", isOpen ? "" : "px-2")}>
        {isOpen ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Connected Capsule
              </span>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <Avatar className="border-2 border-background h-8 w-8">
                  <AvatarImage src={partnerA?.avatarUrl || ""} />
                  <AvatarFallback>{partnerA?.name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background h-8 w-8">
                  <AvatarImage src={partnerB?.avatarUrl || ""} />
                  <AvatarFallback>{partnerB?.name?.[0] || "B"}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium truncate">
                  {partnerA?.name || "Partner A"} &{" "}
                  {partnerB?.name || "Partner B"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background h-8 w-8">
                <AvatarImage src={partnerA?.avatarUrl || ""} />
                <AvatarFallback>{partnerA?.name?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background h-8 w-8">
                <AvatarImage src={partnerB?.avatarUrl || ""} />
                <AvatarFallback>{partnerB?.name?.[0] || "B"}</AvatarFallback>
              </Avatar>
            </div>
            <ThemeToggle />
          </div>
        )}
      </div>
    </aside>
  );
}