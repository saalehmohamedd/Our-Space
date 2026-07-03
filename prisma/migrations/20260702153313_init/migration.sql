-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PARTNER_A', 'PARTNER_B');

-- CreateEnum
CREATE TYPE "WishlistStatus" AS ENUM ('WANT', 'SAVING', 'BOUGHT');

-- CreateEnum
CREATE TYPE "WatchStatus" AS ENUM ('WANT_TO_WATCH', 'WATCHING', 'FINISHED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'TV_SHOW');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('HAPPY', 'ROMANTIC', 'NOSTALGIC', 'SAD', 'EXCITED', 'GRATEFUL', 'CALM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "link" TEXT,
    "notes" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "WishlistStatus" NOT NULL DEFAULT 'WANT',
    "tags" TEXT[],
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingListItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShoppingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "notes" TEXT,
    "estimatedBudget" DECIMAL(65,30),
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "googleMapsUrl" TEXT,
    "visited" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DateOuting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "rating" INTEGER,
    "cost" DECIMAL(65,30),
    "notes" TEXT,
    "tags" TEXT[],
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateOuting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoveLetter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mood" "Mood" NOT NULL DEFAULT 'ROMANTIC',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoveLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateNote" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mood" "Mood",
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "albumCoverUrl" TEXT,
    "spotifyUrl" TEXT,
    "youtubeUrl" TEXT,
    "appleMusicUrl" TEXT,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "playlistId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "posterUrl" TEXT,
    "streamingPlatform" TEXT,
    "trailerUrl" TEXT,
    "imdbUrl" TEXT,
    "notes" TEXT,
    "status" "WatchStatus" NOT NULL DEFAULT 'WANT_TO_WATCH',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "personId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "repeatYearly" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "achievedAt" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_role_key" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Image_entityType_entityId_idx" ON "Image"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Image_isFavorite_idx" ON "Image"("isFavorite");

-- CreateIndex
CREATE INDEX "Memory_isArchived_idx" ON "Memory"("isArchived");

-- CreateIndex
CREATE INDEX "Memory_date_idx" ON "Memory"("date");

-- CreateIndex
CREATE INDEX "WishlistItem_status_idx" ON "WishlistItem"("status");

-- CreateIndex
CREATE INDEX "DateOuting_date_idx" ON "DateOuting"("date");

-- CreateIndex
CREATE INDEX "LoveLetter_date_idx" ON "LoveLetter"("date");

-- CreateIndex
CREATE INDEX "PrivateNote_ownerId_idx" ON "PrivateNote"("ownerId");

-- CreateIndex
CREATE INDEX "Song_playlistId_idx" ON "Song"("playlistId");

-- CreateIndex
CREATE INDEX "WatchItem_status_idx" ON "WatchItem"("status");

-- CreateIndex
CREATE INDEX "Reminder_date_idx" ON "Reminder"("date");

-- CreateIndex
CREATE INDEX "Achievement_isCompleted_idx" ON "Achievement"("isCompleted");

-- AddForeignKey
ALTER TABLE "LoveLetter" ADD CONSTRAINT "LoveLetter_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateNote" ADD CONSTRAINT "PrivateNote_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_personId_fkey" FOREIGN KEY ("personId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
