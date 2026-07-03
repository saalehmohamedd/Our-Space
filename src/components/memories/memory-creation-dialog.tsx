"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  ImagePlus,
  Loader2,
  Sparkles,
  Camera,
  CalendarDays,
  PencilLine,
  X,
  Upload,
} from "lucide-react";
import { getCloudinarySignature } from "@/lib/cloudinary";
import { createMemoryAction } from "@/app/actions/memories";

interface MemoryFormInputs {
  title: string;
  description: string;
  date: string;
}

export function MemoryCreationDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<MemoryFormInputs>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });

  const watchTitle = watch("title");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      if (droppedFile.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: MemoryFormInputs) => {
    if (!file) {
      alert("Please upload a photo for this memory!");
      return;
    }

    try {
      setUploading(true);

      const signData = await getCloudinarySignature();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey!);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Cloudinary direct upload failed");
      const uploadResult = await response.json();

      await createMemoryAction({
        title: data.title,
        description: data.description,
        date: data.date,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });

      setFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("An issue occurred while pinning your memory.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300">
          <PlusCircle className="h-4 w-4" />
          Capture New Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-[500px] rounded-2xl p-0 gap-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Camera className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Add to Scrapbook
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/80 text-sm max-w-xs">
              Capture a beautiful day, milestone, or special moment
            </DialogDescription>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Camera className="h-3 w-3 text-rose-400" />
                Memory Photo
              </Label>
              
              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-rose-200 dark:border-rose-800">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-sm transition"
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs">
                    Photo ready
                  </div>
                </div>
              ) : (
                <div
                  className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
                    dragActive
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20 scale-[1.02]"
                      : "border-muted-foreground/25 hover:border-rose-300 bg-muted/20"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center py-8 px-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                      dragActive 
                        ? "bg-rose-100 dark:bg-rose-900/30" 
                        : "bg-muted"
                    }`}>
                      <Upload className={`h-6 w-6 transition-colors ${
                        dragActive ? "text-rose-500" : "text-muted-foreground"
                      }`} />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Drop your photo here
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      or click to browse • Max 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <PencilLine className="h-3 w-3 text-rose-400" />
                Memory Title
              </Label>
              <Input
                id="title"
                required
                placeholder="Weekend trip to the coast..."
                className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                {...register("title", { required: "Title is required" })}
              />
              {watchTitle && (
                <p className="text-xs text-muted-foreground">
                  ✨ "{watchTitle}" sounds wonderful!
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label
                htmlFor="date"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <CalendarDays className="h-3 w-3 text-rose-400" />
                When did this happen?
              </Label>
              <Input
                id="date"
                type="date"
                required
                className="w-full border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                {...register("date", { required: "Date is required" })}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
              >
                <PencilLine className="h-3 w-3 text-rose-400" />
                Describe the moment
              </Label>
              <Textarea
                id="description"
                placeholder="What made this moment unforgettable?"
                className="w-full resize-none min-h-[80px] border-2 focus:border-rose-400 focus:ring-rose-400/20 transition"
                rows={3}
                {...register("description")}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300"
              disabled={uploading || !file}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading & Archiving...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Lock into Scrapbook
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>📸 New memory capsule</span>
          <span>{file ? "1 photo selected" : "No photo yet"}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}