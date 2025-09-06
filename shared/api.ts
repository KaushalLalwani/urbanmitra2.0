/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Civic issue reporting shared types
export type IssueStatus = "new" | "in_progress" | "resolved";
export type IssueCategory =
  | "Roads"
  | "Water"
  | "Electricity"
  | "Sanitation"
  | "Safety"
  | "Environment"
  | "Other";

export type Urgency = "low" | "medium" | "high";

export interface IssueMedia {
  url: string;
  type: "image" | "video";
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: IssueCategory;
  urgency?: Urgency;
  media?: IssueMedia[];
  status: IssueStatus;
  reporter?: {
    name?: string;
    email?: string;
  };
  assignedTo?: string | null;
  tokenReward?: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  upvotes?: number;
}

export interface IssueFilters {
  query?: string;
  status?: IssueStatus | "all";
  category?: IssueCategory | "all";
}

export interface DashboardStats {
  total: number;
  byStatus: Record<IssueStatus, number>;
  byCategory: Record<IssueCategory, number>;
  avgResolutionHours: number | null;
}
