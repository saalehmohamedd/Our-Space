import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {prisma} from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/auth-guard";
import {
  Heart,
  Gift,
  MapPin,
  Calendar,
  Mail,
  FileText,
  Trophy,
  Bell,
  Clock
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUserOrThrow();

  // Parallel data extraction across relationship entities
  const [
    memoryCount,
    wishlistCount,
    placeCount,
    dateCount,
    letterCount,
    noteCount,
    achievementCount,
    upcomingReminders
  ] = await Promise.all([
    prisma.memory.count({ where: { isArchived: false } }),
    prisma.wishlistItem.count({ where: { isArchived: false } }),
    prisma.place.count({ where: { isArchived: false } }),
    prisma.dateOuting.count({ where: { isArchived: false } }),
    prisma.loveLetter.count(),
    prisma.privateNote.count({ where: { ownerId: user.id } }),
    prisma.achievement.count({ where: { isCompleted: false } }),
    prisma.reminder.findMany({
      take: 3,
      orderBy: { date: "asc" },
      include: { person: true }
    })
  ]);

  const cardsMatrix = [
    {
      title: "Memories Vault",
      description: "Moments captured",
      value: memoryCount,
      metric: "Active entries",
      icon: Heart,
      color: "text-rose-500",
      href: "/memories",
    },
    {
      title: "Shared Wishlist",
      description: "Dreams & micro-savings",
      value: wishlistCount,
      metric: "Items tracked",
      icon: Gift,
      color: "text-amber-500",
      href: "/wishlist",
    },
    {
      title: "Travel Board",
      description: "Next bucket destinations",
      value: placeCount,
      metric: "Locations mapped",
      icon: MapPin,
      color: "text-emerald-500",
      href: "/places",
    },
    {
      title: "Date Outings",
      description: "Planned vs Experienced",
      value: dateCount,
      metric: "Adventures logged",
      icon: Calendar,
      color: "text-sky-500",
      href: "/dates",
    },
    {
      title: "Love Letters",
      description: "Relational time capsules",
      value: letterCount,
      metric: "Letters written",
      icon: Mail,
      color: "text-purple-500",
      href: "/letters",
    },
    {
      title: "Personal Vault",
      description: "Your confidential notes",
      value: noteCount,
      metric: "Saved reflections",
      icon: FileText,
      color: "text-indigo-500",
      href: "/notes",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Structural Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relationship Command Center</h1>
        <p className="text-muted-foreground">
          Real-time relational engine snapshot. Select a node to expand feature layers.
        </p>
      </div>

      <Separator />

      {/* Main Aggregations Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cardsMatrix.map((node) => (
          <Link key={node.title} href={node.href} className="transition-transform hover:scale-[1.01]">
            <Card className="h-full bg-card/60 backdrop-blur-sm cursor-pointer hover:border-muted-foreground/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">{node.title}</CardTitle>
                  <CardDescription className="text-xs">{node.description}</CardDescription>
                </div>
                <node.icon className={`h-5 w-5 ${node.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{node.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{node.metric}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Dynamic Activity Side-Panel Layout */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Achievements Component */}
        <Card className="bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg">Relationship Goals</CardTitle>
              <CardDescription>Unlocking landmarks together</CardDescription>
            </div>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="flex flex-col justify-center py-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight">{achievementCount}</span>
              <span className="text-sm font-medium text-muted-foreground">pending milestones</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Collaborative milestones reinforce unity. Click to review targets.
            </p>
          </CardContent>
        </Card>

        {/* Quick Agenda View */}
        <Card className="bg-card/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
              <CardDescription>Never miss a critical date</CardDescription>
            </div>
            <Bell className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            {upcomingReminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 text-center text-xs text-muted-foreground">
                <Clock className="h-6 w-6 mb-1 text-muted-foreground/50" />
                No upcoming events registered.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="font-medium">{reminder.eventName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reminder.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    {reminder.repeatYearly && <Badge variant="secondary" className="text-[10px]">Annual</Badge>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}