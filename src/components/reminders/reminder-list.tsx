// src/components/reminders/reminder-list.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Calendar,
  Repeat,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Sparkles,
  User,
  Gift,
  Heart,
  Cake,
  Star,
  PartyPopper,
} from "lucide-react";
import { deleteReminderAction } from "@/app/actions/reminders";
import { EditReminderDialog } from "./edit-reminder-dialog";

interface ReminderItem {
  id: string;
  eventName: string;
  date: string;
  repeatYearly: boolean;
  notes: string | null;
  person?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
}

interface ReminderListProps {
  upcoming: ReminderItem[];
  past: ReminderItem[];
}

const eventIcons: Record<string, React.ReactNode> = {
  birthday: <Cake className="h-4 w-4" />,
  anniversary: <Heart className="h-4 w-4" />,
  date: <Sparkles className="h-4 w-4" />,
  celebration: <PartyPopper className="h-4 w-4" />,
  gift: <Gift className="h-4 w-4" />,
  default: <Star className="h-4 w-4" />,
};

function getEventIcon(eventName: string) {
  const lower = eventName.toLowerCase();
  if (lower.includes("birthday")) return eventIcons.birthday;
  if (lower.includes("anniversary")) return eventIcons.anniversary;
  if (lower.includes("date")) return eventIcons.date;
  if (lower.includes("celebration") || lower.includes("party")) return eventIcons.celebration;
  if (lower.includes("gift") || lower.includes("present")) return eventIcons.gift;
  return eventIcons.default;
}

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDaysAgo(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diffTime = now.getTime() - target.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getUrgencyColor(days: number): string {
  if (days <= 1) return "text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200";
  if (days <= 3) return "text-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-200";
  if (days <= 7) return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200";
  return "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200";
}

export function ReminderList({ upcoming, past }: ReminderListProps) {
  const [editingReminder, setEditingReminder] = useState<ReminderItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (reminder: ReminderItem) => {
    setEditingReminder(reminder);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    // Delay clearing to allow dialog animation
    setTimeout(() => setEditingReminder(null), 300);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Upcoming Reminders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Bell className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Upcoming Reminders</h2>
              <p className="text-xs text-muted-foreground">
                {upcoming.length} upcoming {upcoming.length === 1 ? "event" : "events"}
              </p>
            </div>
          </div>

          {upcoming.length === 0 ? (
            <Card className="p-8 text-center bg-muted/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">All caught up! No upcoming reminders.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcoming.map((reminder) => {
                const daysUntil = getDaysUntil(reminder.date);
                const urgencyColor = getUrgencyColor(daysUntil);
                const eventIcon = getEventIcon(reminder.eventName);

                return (
                  <Card
                    key={reminder.id}
                    className="p-4 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${urgencyColor.split(" ")[0].replace("text", "bg")}`} />

                    <div className="pl-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {eventIcon}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{reminder.eventName}</h3>
                            {reminder.person && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {reminder.person.name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(reminder)}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={async () => {
                              if (confirm("Delete this reminder?")) {
                                await deleteReminderAction(reminder.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <Badge className={`border ${urgencyColor}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(reminder.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Badge>

                        {daysUntil === 0 ? (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Today!
                          </Badge>
                        ) : daysUntil === 1 ? (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Tomorrow
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {daysUntil} days
                          </Badge>
                        )}

                        {reminder.repeatYearly && (
                          <Badge variant="outline" className="text-xs">
                            <Repeat className="h-3 w-3 mr-1" />
                            Yearly
                          </Badge>
                        )}
                      </div>

                      {reminder.notes && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {reminder.notes}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Reminders */}
        {past.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-muted-foreground">Past Reminders</h2>
                <p className="text-xs text-muted-foreground">
                  {past.length} completed {past.length === 1 ? "event" : "events"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {past.map((reminder) => {
                const daysAgo = getDaysAgo(reminder.date);
                const eventIcon = getEventIcon(reminder.eventName);

                return (
                  <Card
                    key={reminder.id}
                    className="p-4 opacity-60 hover:opacity-80 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {eventIcon}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm line-through">{reminder.eventName}</h3>
                          {reminder.person && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {reminder.person.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEdit(reminder)}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={async () => {
                            if (confirm("Delete this reminder?")) {
                              await deleteReminderAction(reminder.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(reminder.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Badge>
                      <span className="text-muted-foreground">
                        {daysAgo} {daysAgo === 1 ? "day" : "days"} ago
                      </span>
                      {reminder.repeatYearly && (
                        <Badge variant="outline" className="text-xs">
                          <Repeat className="h-3 w-3 mr-1" />
                          Yearly
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog - Only render when there's a reminder to edit */}
      {editingReminder && (
        <EditReminderDialog
          reminder={editingReminder}
          open={isEditOpen}
          onOpenChange={handleCloseEdit}
        />
      )}
    </>
  );
}