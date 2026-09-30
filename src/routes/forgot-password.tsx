import { createFileRoute, Link } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { buildSeoHead } from "@/lib/seo";
import { ShieldCheck, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/forgot-password")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { mode?: "request" | "reset"; email?: string } => ({
    mode: search.mode === "reset" ? "reset" : "request",
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  head: () =>
    buildSeoHead({
      title: "Reset Your Password · Sports Account Recovery | KhelGrid",
      description:
        "Reset your KhelGrid password. Secure account recovery for athletes, certified coaches, and sports academy administrators.",
      canonicalPath: "/forgot-password",
      noindex: true,
      type: "website",
    }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const search = Route.useSearch();

  return (
    <main className="min-h-[80vh] flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-foreground">
            Khel<span className="text-primary">Grid</span>
          </span>
        </Link>
        <p className="text-xs text-muted-foreground">
          India&apos;s Grassroots Sports Ecosystem & Selection Network
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <ForgotPasswordForm initialMode={search.mode} defaultEmail={search.email} />

        <div className="mt-6 text-center">
          <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <Link to="/login">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to Sports Portal Login
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
