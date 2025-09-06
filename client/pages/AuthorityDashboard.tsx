import Layout from "@/components/layout/Layout";
import { useIssues } from "@/context/IssuesContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function AuthorityDashboard() {
  const { issues, updateStatus, stats } = useIssues();
  const s = stats();

  const byCategory = Object.entries(s.byCategory).map(([k, v]) => ({ category: k, count: v }));

  return (
    <Layout>
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Authority Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage assigned issues, update statuses, and view analytics.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Total Reports</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{s.total}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>In Progress</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{s.byStatus.in_progress}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Avg Resolution (hrs)</CardTitle></CardHeader>
            <CardContent className="text-3xl font-bold">{s.avgResolutionHours ?? "-"}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Category Trends</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <XAxis dataKey="category" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="count" fill="url(#grad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assigned Issues</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.title}</TableCell>
                    <TableCell>{i.category}</TableCell>
                    <TableCell>{i.location}</TableCell>
                    <TableCell className="w-[180px]">
                      <Select value={i.status} onValueChange={(v) => updateStatus(i.id, v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {!issues.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">No issues yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
