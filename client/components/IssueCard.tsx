import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIssues } from "@/context/IssuesContext";
import type { Issue } from "@shared/api";

function StatusBadge({ status }: { status: Issue["status"] }) {
  const map: Record<Issue["status"], string> = {
    new: "bg-amber-100 text-amber-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-emerald-100 text-emerald-800",
  };
  const label: Record<Issue["status"], string> = {
    new: "New",
    in_progress: "In Progress",
    resolved: "Resolved",
  };
  return <Badge className={map[status]}>{label[status]}</Badge>;
}

export default function IssueCard({ issue }: { issue: Issue }) {
  const { updateStatus } = useIssues();
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{issue.title}</CardTitle>
        <StatusBadge status={issue.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {issue.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            Category:{" "}
            <span className="font-medium text-foreground">
              {issue.category}
            </span>
          </div>
          <div>
            Location:{" "}
            <span className="font-medium text-foreground">
              {issue.location}
            </span>
          </div>
        </div>
        {issue.media?.[0] && (
          <div className="overflow-hidden rounded-md border">
            {issue.media[0].type === "image" ? (
              <img
                src={issue.media[0].url}
                className="w-full h-44 object-cover"
              />
            ) : (
              <video
                src={issue.media[0].url}
                className="w-full h-44 object-cover"
                controls
              />
            )}
          </div>
        )}
        <div className="flex items-center gap-2 pt-1">
          {issue.urgency && <Badge variant="outline">{issue.urgency}</Badge>}
          {issue.assignedTo && (
            <Badge variant="secondary">Assigned: {issue.assignedTo}</Badge>
          )}
        </div>
        {issue.status !== "resolved" && (
          <div className="pt-2">
            <button
              onClick={() =>
                updateStatus(
                  issue.id,
                  issue.status === "new" ? "in_progress" : "resolved",
                )
              }
              className="text-xs rounded-md border px-3 py-1.5 hover:bg-muted"
            >
              Mark {issue.status === "new" ? "In Progress" : "Resolved"}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
