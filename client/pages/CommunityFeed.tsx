import Layout from "@/components/layout/Layout";
import IssueCard from "@/components/IssueCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIssues } from "@/context/IssuesContext";
import { useState, useMemo } from "react";
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

export default function CommunityFeed() {
  const { filtered } = useIssues();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [status, setStatus] = useState<"all" | "new" | "in_progress" | "resolved">("all");
  const list = useMemo(() => filtered({ query, category, status }), [filtered, query, category, status]);

  return (
    <Layout>
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Community Feed</h1>
          <p className="text-muted-foreground mt-2">Browse recent reports, filter by status or category, and track progress.</p>
        </div>

        <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1">
              <Input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="min-w-[180px]">
              <Select onValueChange={(v) => setCategory(v as any)}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{String(c)}</SelectItem>
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
              <TabsContent value="all" className="mt-4 grid gap-4 md:grid-cols-2">
                {list.map((i) => (
                  <IssueCard key={i.id} issue={i} />
                ))}
                {!list.length && <p className="text-sm text-muted-foreground">No matching results.</p>}
              </TabsContent>
              <TabsContent value="new" className="mt-4 grid gap-4 md:grid-cols-2">
                {list.map((i) => (
                  <IssueCard key={i.id} issue={i} />
                ))}
                {!list.length && <p className="text-sm text-muted-foreground">No matching results.</p>}
              </TabsContent>
              <TabsContent value="in_progress" className="mt-4 grid gap-4 md:grid-cols-2">
                {list.map((i) => (
                  <IssueCard key={i.id} issue={i} />
                ))}
                {!list.length && <p className="text-sm text-muted-foreground">No matching results.</p>}
              </TabsContent>
              <TabsContent value="resolved" className="mt-4 grid gap-4 md:grid-cols-2">
                {list.map((i) => (
                  <IssueCard key={i.id} issue={i} />
                ))}
                {!list.length && <p className="text-sm text-muted-foreground">No matching results.</p>}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
