// app/(app)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Heart, Menu } from "lucide-react";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { navigationItems } from "@/lib/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToastProvider } from "@/components/providers/toast-provider";
import { GlobalSearch } from "@/components/global-search";
import { GlobalFilters } from "@/components/global-filters";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentUser;

  try {
    currentUser = await getCurrentUserOrThrow();
  } catch (error) {
    console.error(error);
    throw error;
  }

  // Fetch both partners to show the relationship state in the UI
  const partners = await prisma.user.findMany({
    orderBy: { role: "asc" },
  });

  const partnerA = partners.find((p) => p.role === "PARTNER_A");
  const partnerB = partners.find((p) => p.role === "PARTNER_B");

  const NavLinks = () => (
    <div className="space-y-1">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar partnerA={partnerA} partnerB={partnerB} />

      {/* Main Application Window */}
      <div className="flex flex-1 flex-col">
        {/* Top Floating bar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-0 flex flex-col h-full"
              >
                <div className="px-6 py-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500 fill-current" />
                    <span className="font-semibold">Our Space</span>
                  </SheetTitle>
                </div>
                <ScrollArea className="flex-1 px-4 py-4">
                  <NavLinks />
                </ScrollArea>
                <div className="p-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Cap-v1.0
                  </span>
                  <ThemeToggle />
                </div>
              </SheetContent>
            </Sheet>

            <h2 className="text-sm font-medium text-muted-foreground hidden md:inline-block">
              Welcome back,{" "}
              <span className="text-foreground font-semibold">
                {currentUser.name}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <GlobalFilters
              filters={{
                sort: [
                  { label: "Newest", value: "newest" },
                  { label: "Oldest", value: "oldest" },
                  { label: "A-Z", value: "az" },
                ],
              }}
            />
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>

        {/* Workspace Canvas viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/10">
          {children}
          <ToastProvider />
        </main>
      </div>
    </div>
  );
}
