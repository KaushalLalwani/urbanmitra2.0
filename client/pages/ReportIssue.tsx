import Layout from "@/components/layout/Layout";
import IssueForm from "@/components/IssueForm";

export default function ReportIssue() {
  return (
    <Layout>
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Report an Issue</h1>
        <IssueForm />
      </section>
    </Layout>
  );
}
