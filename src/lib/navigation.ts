// Update your navigator.ts
import {
  LayoutDashboard,
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
  Star, // Add this
} from "lucide-react";

export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Favorites", href: "/favorites", icon: Star }, // Add this
  { name: "Memories", href: "/memories", icon: Heart },
  { name: "Wishlist", href: "/wishlist", icon: Gift },
  { name: "Shopping List", href: "/shopping", icon: ShoppingBag },
  { name: "Travel Places", href: "/travil-places", icon: MapPin },
  { name: "Date Outings", href: "/dates", icon: Calendar },
  { name: "Love Letters", href: "/letters", icon: Mail },
  { name: "Private Notes", href: "/notes", icon: FileText },
  { name: "Playlists", href: "/playlists", icon: Music },
  { name: "Watchlist", href: "/watchlist", icon: Tv },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "Achievements", href: "/achievements", icon: Trophy },
];