// src/types/index.ts


export interface PlaceItemType {
  id: string;
  name: string;
  location: string;
  country: string ; // Made required to match PlaceEditDialog
  costEstimate: any; 
  status: "BUCKET_LIST" | "PLANNING" | "VISITED";
  notes: string | null
  isFavorite?: boolean;
  isArchived?: boolean;
}
// Base serializable item type
export interface SerializableItem {
  id: string;
  [key: string]: unknown;
}

// Page props type
export interface PageProps {
  searchParams: Promise<{ sort?: string; filter?: string; category?: string }>;
}

// Form data generic type
export type FormData = Record<string, unknown>;

// API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Serialized date fields
export interface SerializedDates {
  date?: string | null;
  scheduledAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  achievedAt?: string | null;
  targetDate?: string | null;
}

// Serialized decimal fields
export interface SerializedDecimals {
  price?: string | null;
  costEstimate?: string | null;
  cost?: string | null;
  estimatedBudget?: string | null;
}