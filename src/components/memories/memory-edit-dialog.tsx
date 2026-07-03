// src/components/memories/memory-edit-dialog.tsx
"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Image as ImageIcon,
  CalendarDays,
  PencilLine,
  Sparkles,
  X,
  Upload,
  Camera,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react";
import { updateMemoryAction } from "@/app/actions/memories";
import { uploadImageAction, deleteImageAction } from "@/app/actions/upload";
import { showToast } from "@/lib/toast";

interface ImageItem {
  id: string;
  url: string;
  publicId?: string;
}

interface MemoryItem {
  id: string;
  title: string;
  description: string | null;
  date: Date | string;
  isFavorite: boolean;
  isArchived: boolean;
  images: ImageItem[];
}

interface MemoryEditDialogProps {
  memory: MemoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditFormInputs {
  title: string;
  description: string;
  date: string;
}

// Cloudinary URL optimizer for better performance
function getOptimizedImageUrl(url: string): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const parts = url.split("/upload/");
  if (parts.length === 2 && !parts[1].startsWith("f_auto")) {
    return `${parts[0]}/upload/f_auto,q_auto,w_600,c_fill/${parts[1]}`;
  }
  return url;
}

// Get original quality URL for download
function getOriginalImageUrl(url: string): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  // Remove any existing transformations to get original
  const parts = url.split("/upload/");
  if (parts.length === 2) {
    // Check if there are transformations
    const afterUpload = parts[1];
    if (
      afterUpload.includes("/") &&
      (afterUpload.startsWith("f_") ||
        afterUpload.startsWith("q_") ||
        afterUpload.startsWith("w_") ||
        afterUpload.startsWith("c_"))
    ) {
      const transformEnd = afterUpload.indexOf("/");
      if (transformEnd !== -1) {
        return `${parts[0]}/upload/${afterUpload.substring(transformEnd + 1)}`;
      }
    }
  }
  return url;
}

// Download image function
async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    showToast.success("Image downloaded!", filename);
  } catch (error) {
    console.error("Download failed:", error);
    showToast.error(
      "Download failed",
      "Could not download the image. Try opening it in a new tab.",
    );
  }
}

export function MemoryEditDialog({
  memory,
  open,
  onOpenChange,
}: MemoryEditDialogProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [localImages, setLocalImages] = useState<ImageItem[]>(
    memory.images || [],
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<EditFormInputs>({
    values: {
      title: memory.title,
      description: memory.description || "",
      date: new Date(memory.date).toISOString().split("T")[0],
    },
  });

  // Reset form and images when memory prop changes
  React.useEffect(() => {
    if (open) {
      reset({
        title: memory.title,
        description: memory.description || "",
        date: new Date(memory.date).toISOString().split("T")[0],
      });
      setLocalImages(memory.images || []);
      setSelectedImageIndex(0);
    }
  }, [open, memory, reset]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();

      // Upload each selected file
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
      formData.append("memoryId", memory.id);

      const uploadedImages = await uploadImageAction(formData);

      if (uploadedImages && uploadedImages.length > 0) {
        // Ensure each uploaded image has an id (use temporary id if missing)
        const imagesWithId = uploadedImages.map((img: any) => ({
          id:
            img.id ||
            `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: img.url,
          publicId: img.publicId || undefined,
        }));

        setLocalImages((prev) => [...prev, ...imagesWithId]);
        // Select the first newly uploaded image
        setSelectedImageIndex(localImages.length);
        showToast.success(
          "Images uploaded!",
          `${uploadedImages.length} photo(s) added`,
        );
      }
    } catch (error) {
      console.error("Failed to upload images:", error);
      showToast.error(
        "Upload failed",
        "Failed to upload images. Please try again.",
      );
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (imageToDelete: ImageItem, index: number) => {
    if (!confirm("Are you sure you want to remove this image?")) return;

    try {
      setDeletingImage(true);

      if (imageToDelete.publicId) {
        await deleteImageAction(imageToDelete.publicId);
      }

      const updatedImages = localImages.filter((_, i) => i !== index);
      setLocalImages(updatedImages);

      // Adjust selected index if needed
      if (selectedImageIndex >= updatedImages.length) {
        setSelectedImageIndex(Math.max(0, updatedImages.length - 1));
      }

      showToast.success("Image removed");
    } catch (error) {
      console.error("Failed to delete image:", error);
      showToast.error(
        "Delete failed",
        "Failed to delete image. Please try again.",
      );
    } finally {
      setDeletingImage(false);
    }
  };

  const onUpdateSubmit = async (data: EditFormInputs) => {
    try {
      setUpdating(true);

      const promise = updateMemoryAction(memory.id, {
        ...data,
        images: localImages,
      });

      showToast.promise(promise, {
        loading: "Saving changes...",
        success: "Memory updated! ✨",
        error: "Failed to update memory",
      });

      await promise;
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update memory:", err);
    } finally {
      setUpdating(false);
    }
  };

  const hasImages = localImages.length > 0;
  const currentImage = hasImages ? localImages[selectedImageIndex] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Image Gallery Section */}
        <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-purple-950/30">
          {hasImages ? (
            <>
              <img
                src={getOptimizedImageUrl(currentImage!.url)}
                alt={`${memory.title} - Image ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
              />

              {/* Image counter badge */}
              {localImages.length > 1 && (
                <Badge
                  variant="secondary"
                  className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white border-0 text-xs font-medium px-2.5 py-1"
                >
                  {selectedImageIndex + 1} / {localImages.length}
                </Badge>
              )}

              {/* Top left action buttons */}
              <div className="absolute top-3 left-3 flex gap-2">
                {/* Delete current image button */}
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteImage(currentImage!, selectedImageIndex)
                  }
                  disabled={deletingImage}
                  className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 backdrop-blur-md text-white transition disabled:opacity-50"
                  title="Delete current image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Download button */}
                <button
                  type="button"
                  onClick={() => {
                    const originalUrl = getOriginalImageUrl(currentImage!.url);
                    const filename = `${memory.title.replace(/\s+/g, "-").toLowerCase()}-image-${selectedImageIndex + 1}.jpg`;
                    downloadImage(originalUrl, filename);
                  }}
                  className="p-2 rounded-full bg-blue-500/80 hover:bg-blue-600 backdrop-blur-md text-white transition"
                  title="Download image"
                >
                  <Download className="h-4 w-4" />
                </button>

                {/* Open in new tab button */}
                <button
                  type="button"
                  onClick={() => {
                    const originalUrl = getOriginalImageUrl(currentImage!.url);
                    window.open(originalUrl, "_blank");
                  }}
                  className="p-2 rounded-full bg-green-500/80 hover:bg-green-600 backdrop-blur-md text-white transition"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation arrows for multiple images */}
              {localImages.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 flex justify-between p-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? localImages.length - 1 : prev - 1,
                      );
                    }}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) =>
                        prev === localImages.length - 1 ? 0 : prev + 1,
                      );
                    }}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-3 bg-muted/30">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-rose-400 stroke-1" />
              </div>
              <p className="text-sm font-medium">No images attached yet</p>
              <p className="text-xs text-muted-foreground/60">
                Upload your first image below
              </p>
            </div>
          )}

          {/* Upload image button overlay */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer p-2 rounded-full bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md text-white transition flex items-center justify-center"
              title="Add new images"
            >
              {uploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </label>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-5 sm:p-6 space-y-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <PencilLine className="h-4 w-4 text-rose-500" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Edit Memory
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground pl-10">
              Refine the details of your captured moment
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
            {/* Image management section */}
            <div className="space-y-2 p-3 rounded-xl bg-muted/30 border-2 border-dashed">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Images ({localImages.length})
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="h-8 text-xs"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-1 h-3 w-3" />
                        Add Photos
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Image thumbnails grid */}
              {localImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {localImages.map((image, index) => (
                    <div
                      key={image.id || index}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition group/thumb ${
                        index === selectedImageIndex
                          ? "border-rose-500 shadow-md"
                          : "border-transparent hover:border-rose-300"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={getOptimizedImageUrl(image.url)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Thumbnail actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const originalUrl = getOriginalImageUrl(image.url);
                            const filename = `${memory.title.replace(/\s+/g, "-").toLowerCase()}-thumb-${index + 1}.jpg`;
                            downloadImage(originalUrl, filename);
                          }}
                          className="p-1 rounded-full bg-blue-500/80 text-white hover:bg-blue-600"
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image, index);
                          }}
                          className="p-1 rounded-full bg-red-500/80 text-white hover:bg-red-600"
                          disabled={deletingImage}
                          title="Delete"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-title"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Title
              </Label>
              <Input
                id="edit-title"
                placeholder="Give your memory a name..."
                className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                {...register("title", { required: "Title is required" })}
              />
            </div>

            {/* Date Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-date"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Date
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="edit-date"
                  type="date"
                  className="w-full pl-10 border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                  {...register("date", { required: "Date is required" })}
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-description"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="edit-description"
                placeholder="What made this moment special..."
                className="w-full resize-none min-h-[100px] border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                rows={3}
                {...register("description")}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={updating}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updating ||
                  (!isDirty && localImages.length === memory.images.length)
                }
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Info Footer */}
        <div className="px-5 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {memory.isFavorite ? "❤️ Favorited memory" : "📸 Memory capsule"}
          </span>
          <span>
            {hasImages
              ? `${localImages.length} image${localImages.length > 1 ? "s" : ""}`
              : "No images"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
