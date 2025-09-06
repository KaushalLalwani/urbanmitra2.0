import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <Navbar />
      <main className="container py-8">{children}</main>
      <footer className="border-t mt-16 py-10 text-sm text-foreground/60">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} CivicPulse. Built for engaged communities.
          </p>
          <div className="flex items-center gap-3">
            <a className="hover:text-foreground" href="/feed">Community</a>
            <a className="hover:text-foreground" href="/authority">Authority</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
