import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import type {
  DashboardStats,
  Issue,
  IssueCategory,
  IssueFilters,
  IssueStatus,
} from "@shared/api";

const ISSUE_STORAGE_KEY = "civic_issues_v1";

const IssueSchema: z.ZodType<Issue> = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  category: z.custom<IssueCategory>(),
  urgency: z.enum(["low", "medium", "high"]).optional(),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "video"]),
      }),
    )
    .optional(),
  status: z.enum(["new", "in_progress", "resolved"]),
  reporter: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
    })
    .optional(),
  assignedTo: z.string().nullable().optional(),
  tokenReward: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  upvotes: z.number().optional(),
});

const IssuesArraySchema = z.array(IssueSchema);

type Ctx = {
  issues: Issue[];
  addIssue: (
    input: Omit<Issue, "id" | "createdAt" | "updatedAt" | "status">,
  ) => Issue;
  updateStatus: (id: string, status: IssueStatus) => void;
  assignIssue: (id: string, assignee: string | null) => void;
  filtered: (filters: IssueFilters) => Issue[];
  stats: () => DashboardStats;
  clearAll: () => void;
};

const IssuesContext = createContext<Ctx | null>(null);

function loadIssues(): Issue[] {
  try {
    const raw = localStorage.getItem(ISSUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const issues = IssuesArraySchema.parse(parsed);
    return issues;
  } catch {
    return [];
  }
}

function saveIssues(issues: Issue[]) {
  localStorage.setItem(ISSUE_STORAGE_KEY, JSON.stringify(issues));
}

export function IssuesProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setIssues(loadIssues());
  }, []);

  useEffect(() => {
    saveIssues(issues);
  }, [issues]);

  const api = useMemo<Ctx>(
    () => ({
      issues,
      addIssue: (input) => {
        const now = new Date().toISOString();
        const issue: Issue = {
          id: crypto.randomUUID(),
          status: "new",
          createdAt: now,
          updatedAt: now,
          upvotes: 0,
          ...input,
        };
        setIssues((prev) => [issue, ...prev]);
        return issue;
      },
      updateStatus: (id, status) => {
        setIssues((prev) =>
          prev.map((i) =>
            i.id === id
              ? { ...i, status, updatedAt: new Date().toISOString() }
              : i,
          ),
        );
      },
      assignIssue: (id, assignee) => {
        setIssues((prev) =>
          prev.map((i) => (i.id === id ? { ...i, assignedTo: assignee } : i)),
        );
      },
      filtered: ({ query, status, category }) => {
        let list = issues;
        if (status && status !== "all")
          list = list.filter((i) => i.status === status);
        if (category && category !== "all")
          list = list.filter((i) => i.category === category);
        if (query) {
          const q = query.toLowerCase();
          list = list.filter(
            (i) =>
              i.title.toLowerCase().includes(q) ||
              i.description.toLowerCase().includes(q) ||
              i.location.toLowerCase().includes(q),
          );
        }
        return list;
      },
      stats: () => {
        const byStatus = { new: 0, in_progress: 0, resolved: 0 } as Record<
          IssueStatus,
          number
        >;
        const byCategory = {
          Roads: 0,
          Water: 0,
          Electricity: 0,
          Sanitation: 0,
          Safety: 0,
          Environment: 0,
          Other: 0,
        } as Record<IssueCategory, number>;

        issues.forEach((i) => {
          byStatus[i.status]++;
          byCategory[i.category]++;
        });

        // naive resolution time: createdAt -> updatedAt when resolved
        const durations: number[] = [];
        issues.forEach((i) => {
          if (i.status === "resolved") {
            const start = new Date(i.createdAt).getTime();
            const end = new Date(i.updatedAt).getTime();
            durations.push((end - start) / (1000 * 60 * 60));
          }
        });
        const avgResolutionHours = durations.length
          ? Math.round(
              (durations.reduce((a, b) => a + b, 0) / durations.length) * 10,
            ) / 10
          : null;

        return {
          total: issues.length,
          byStatus,
          byCategory,
          avgResolutionHours,
        };
      },
      clearAll: () => setIssues([]),
    }),
    [issues],
  );

  return (
    <IssuesContext.Provider value={api}>{children}</IssuesContext.Provider>
  );
}

export function useIssues() {
  const ctx = useContext(IssuesContext);
  if (!ctx) throw new Error("useIssues must be used within IssuesProvider");
  return ctx;
}

export async function uploadToCloudinary(
  file: File,
): Promise<{ url: string; type: "image" | "video" } | null> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
    | string
    | undefined;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
    | string
    | undefined;

  const type: "image" | "video" = file.type.startsWith("video")
    ? "video"
    : "image";

  if (!cloudName || !preset) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: String(reader.result), type });
      reader.readAsDataURL(file);
    });
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) return null;
  const data = await res.json();
  return { url: data.secure_url, type };
}
