import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"user" | "authority">("user");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    login({ role, token: "demo-token" });
    navigate("/");
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">Register</h1>
        <p className="text-muted-foreground mt-2">
          Create an account and choose your role.
        </p>
        <form
          onSubmit={submit}
          className="mt-6 space-y-4 rounded-xl border bg-card p-6 shadow-sm"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="authority">Authority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white hover:opacity-90 w-full"
          >
            Create account
          </Button>
        </form>
      </div>
    </Layout>
  );
}
