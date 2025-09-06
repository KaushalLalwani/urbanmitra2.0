import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [role, setRole] = useState<"user" | "authority">("user");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    login({ role, token: "demo-token" });
    const to = location.state?.from?.pathname || "/";
    navigate(to);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">Login</h1>
        <p className="text-muted-foreground mt-2">Choose a role to explore protected areas.</p>
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="authority">Authority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white hover:opacity-90 w-full">Login</Button>
          <p className="text-sm text-muted-foreground">No account? <Link className="underline" to="/register">Register</Link></p>
        </form>
      </div>
    </Layout>
  );
}
