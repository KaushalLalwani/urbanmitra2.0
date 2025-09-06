import { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import IssueCard from "@/components/IssueCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIssues } from "@/context/IssuesContext";
import type { IssueCategory } from "@shared/api";

const categories: (IssueCategory | "all")[] = [
  "all",
  "Roads",
  "Water",
  "Electricity",
  "Sanitation",
  "Safety",
  "Environment",
  "Other",
];

export default function Index() {
  const { filtered } = useIssues();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [status, setStatus] = useState<
    "all" | "new" | "in_progress" | "resolved"
  >("all");

  const list = useMemo(
    () => filtered({ query, category, status }),
    [filtered, query, category, status],
  );

  return (
    <Layout>
      <section className="py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Empower your city with CivicPulse
              </h1>
              <p className="mt-3 text-muted-foreground">
                Report issues in seconds, track progress, and celebrate
                resolutions together.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                  Secure uploads
                </span>
                <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
                  Real-time status
                </span>
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                  Token rewards
                </span>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">
                To submit a report, please login and go to the Report page.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="/login"
                  className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Login
                </a>
                <a
                  href="/report-issue"
                  className="inline-flex items-center rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
                >
                  Go to Report
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search reports by title, description, or location"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="min-w-[180px]">
                  <Select onValueChange={(v) => setCategory(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {String(c).charAt(0).toUpperCase() +
                            String(c).slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Tabs value={status} onValueChange={(v) => setStatus(v as any)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4 space-y-4">
                    {list.map((i) => (
                      <IssueCard key={i.id} issue={i} />
                    ))}
                    {!list.length && (
                      <p className="text-sm text-muted-foreground">
                        No reports yet. Be the first to report an issue!
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="new" className="mt-4 space-y-4">
                    {list.map((i) => (
                      <IssueCard key={i.id} issue={i} />
                    ))}
                    {!list.length && (
                      <p className="text-sm text-muted-foreground">
                        Nothing here.
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="in_progress" className="mt-4 space-y-4">
                    {list.map((i) => (
                      <IssueCard key={i.id} issue={i} />
                    ))}
                    {!list.length && (
                      <p className="text-sm text-muted-foreground">
                        Nothing here.
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="resolved" className="mt-4 space-y-4">
                    {list.map((i) => (
                      <IssueCard key={i.id} issue={i} />
                    ))}
                    {!list.length && (
                      <p className="text-sm text-muted-foreground">
                        Nothing here.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
