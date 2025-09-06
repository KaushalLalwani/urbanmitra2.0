import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadToCloudinary, useIssues } from "@/context/IssuesContext";
import type { Issue, IssueCategory, Urgency } from "@shared/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories: IssueCategory[] = [
  "Roads",
  "Water",
  "Electricity",
  "Sanitation",
  "Safety",
  "Environment",
  "Other",
];

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  category: z.enum(categories as [IssueCategory, ...IssueCategory[]]),
  urgency: z.enum(["low", "medium", "high"]).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function IssueForm({
  onSubmitted,
}: {
  onSubmitted?: (issue: Issue) => void;
}) {
  const { addIssue } = useIssues();
  const [uploads, setUploads] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { urgency: undefined },
  });

  async function onSubmit(values: FormValues) {
    const issue = addIssue({
      title: values.title,
      description: values.description,
      location: values.location,
      category: values.category,
      urgency: values.urgency as Urgency | undefined,
      media: uploads,
      reporter: { email: undefined },
      assignedTo: null,
      tokenReward: 0,
      upvotes: 0,
    });
    onSubmitted?.(issue);
    form.reset();
    setUploads([]);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    const results: { url: string; type: "image" | "video" }[] = [];
    for (const f of Array.from(files)) {
      const res = await uploadToCloudinary(f);
      if (res) results.push(res);
    }
    setUploads((prev) => [...prev, ...results]);
    setUploading(false);
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Report an Issue</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Help improve your city. Provide clear details and optional media.
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Pothole on Main St"
              {...form.register("title")}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Main St & 3rd Ave"
              {...form.register("location")}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(v) =>
                form.setValue("category", v as IssueCategory)
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <Select
              onValueChange={(v) => form.setValue("urgency", v as Urgency)}
            >
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                {(["low", "medium", "high"] as const).map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Describe the issue clearly..."
            {...form.register("description")}
          />
        </div>
        <div className="space-y-2">
          <Label>Attach media</Label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {uploading && (
            <p className="text-xs text-muted-foreground">Uploading...</p>
          )}
          {!!uploads.length && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              {uploads.map((m, i) => (
                <div
                  key={i}
                  className="relative aspect-video overflow-hidden rounded-md border"
                >
                  {m.type === "image" ? (
                    <img
                      src={m.url}
                      alt="upload"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={m.url}
                      className="h-full w-full object-cover"
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-2">
          <Button
            type="submit"
            className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white hover:opacity-90"
          >
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
}
