import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trophy, Smartphone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log In · KhelGrid" }, { name: "description", content: "Log in to KhelGrid to apply to trials and manage your Sports CV." }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Signed in (demo)");
    nav({ to: "/dashboard" });
  };

  return (
    <main className="mx-auto grid max-w-md px-4 py-20">
      <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-elevated">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Welcome back</h1>
            <p className="text-xs text-muted-foreground">Log in with your mobile number</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="phone">Mobile number</Label>
            <div className="relative mt-1">
              <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98xxxxxx00" className="pl-9" required />
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-95">Send OTP</Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          New here? <Link to="/start-from-zero" className="text-primary hover:underline">Start from zero →</Link>
        </div>

        <Badge variant="outline" className="mt-6 w-full justify-center border-border text-xs text-muted-foreground">Demo · no real OTP sent</Badge>
      </div>
    </main>
  );
}
