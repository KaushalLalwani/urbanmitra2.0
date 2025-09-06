import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const nav = [
    { to: "/", label: "Home" },
    { to: "/community", label: "Community" },
    { to: "/authority-dashboard", label: "Authority" },
    { to: "/profile", label: "Profile" },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500" />
          <span className="font-extrabold tracking-tight text-lg">
            CivicPulse
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "transition-colors hover:text-foreground/90",
                  isActive || location.pathname === n.to
                    ? "text-foreground"
                    : "text-foreground/60",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/report-issue"
            className="inline-flex items-center rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
          >
            Report Issue
          </Link>
        </div>
      </div>
    </header>
  );
}
