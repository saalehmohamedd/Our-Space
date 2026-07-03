"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Heart, Lock, Sparkles, Compass, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SignOutButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle" // double-check your pathing alias

export default function MarketingPage() {
  const features = [
    {
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      title: "Shared Memories",
      description: "A private visual timeline of your milestones, trips, and daily small victories.",
    },
    {
      icon: <Lock className="h-6 w-6 text-blue-500" />,
      title: "Strictly for Two",
      description: "Protected by military-grade token routing. Only your two specific emails are granted entry.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: "The Wishlist & Planners",
      description: "Keep tabs on dates you want to go on, gifts to save for, and movies to screen together.",
    },
    {
      icon: <Music className="h-6 w-6 text-purple-500" />,
      title: "Shared Playlists",
      description: "Index your core soundtracks from Spotify, YouTube, or Apple Music in one home base.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-rose-500/10 p-1.5 text-rose-500">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Our Space</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard" className="group flex items-center gap-1.5">
                Enter Space
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center space-x-1.5 rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5 text-rose-500" />
            <span>An Invite-Only Private Universe</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
            Your relationship deserves its own private digital home.
          </h1>
          
          <p className="mx-auto max-w-xl text-lg text-muted-foreground sm:text-xl">
            No public feeds, no global comments, no algorithms. Just a shared workspace and digital scrapbook designed explicitly for you two.
          </p>

          <div className="pt-4">
            <Button size="lg" className="h-12 px-6 text-md font-medium group shadow-lg shadow-rose-500/10" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                Open Your Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-24 grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:gap-8"
        >
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-foreground/10">
              <CardHeader className="flex flex-row items-center space-x-4 space-y-0 pb-3">
                <div className="rounded-xl border bg-background p-2.5 shadow-sm">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-bold tracking-tight">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-left text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Our Space. End-to-end relational capsule. Built for two.
        </div>
      </footer>
    </div>
  );
}