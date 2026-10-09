import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Send,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export interface ForgotPasswordFormProps {
  /**
   * Initial mode: 'request' (enter email to receive reset link) or 'reset' (enter new password).
   */
  initialMode?: "request" | "reset";
  /**
   * Pre-filled email address.
   */
  defaultEmail?: string;
  /**
   * Callback to navigate back to sign in.
   */
  onBackToSignIn?: () => void;
  /**
   * Callback fired on successful email dispatch or password reset.
   */
  onSuccess?: () => void;
  /**
   * Custom CSS classes.
   */
  className?: string;
}

export function ForgotPasswordForm({
  initialMode = "request",
  defaultEmail = "",
  onBackToSignIn,
  onSuccess,
  className = "",
}: ForgotPasswordFormProps) {
  const navigate = useNavigate();
  const { resetPassword, updatePassword } = useAuth();

  const [mode, setMode] = useState<"request" | "sent" | "reset">(() => {
    // Check if URL contains recovery hash
    if (typeof window !== "undefined") {
      const hash = window.location.hash || "";
      const search = window.location.search || "";
      if (hash.includes("type=recovery") || search.includes("mode=reset")) {
        return "reset";
      }
    }
    return initialMode;
  });

  const [email, setEmail] = useState(defaultEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle requesting the password reset email
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/forgot-password?mode=reset`
          : undefined;

      const res = await resetPassword(cleanEmail, redirectTo);

      if (res.success) {
        setMode("sent");
        setResendCooldown(60);
        toast.success("Password reset instructions sent!", {
          description: `Check the inbox for ${cleanEmail}.`,
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.error || "Failed to send password reset email. Please try again.");
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while requesting password reset.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle setting new password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const res = await updatePassword(newPassword);

      if (res.success) {
        toast.success("Password updated successfully!", {
          description: "You can now log in with your new credentials.",
        });
        if (onSuccess) onSuccess();
        if (onBackToSignIn) {
          onBackToSignIn();
        } else {
          navigate({ to: "/login" });
        }
      } else {
        setErrorMessage(res.error || "Failed to update password. Recovery link may have expired.");
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while updating your password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================== CONFIRMATION SENT VIEW =====================
  if (mode === "sent") {
    return (
      <Card className={`border-emerald-500/20 bg-card shadow-sm ${className}`}>
        <CardHeader className="text-center pb-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-2">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <Badge
            variant="outline"
            className="mx-auto border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-0.5"
          >
            Instructions Dispatched
          </Badge>
          <CardTitle className="text-xl font-bold mt-2">Check Your Email</CardTitle>
          <CardDescription className="text-xs max-w-sm mx-auto">
            We sent a secure password recovery link to{" "}
            <span className="font-semibold text-foreground">{email}</span>. Click the link in the
            email to choose a new password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground">Didn&apos;t receive the email?</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li>Check your spam or junk folder</li>
              <li>Verify you typed your email address correctly</li>
              <li>Wait a few moments before requesting a new link</li>
            </ul>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={resendCooldown > 0 || loading}
            onClick={handleRequestReset}
            className="w-full text-xs h-9"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Resending...
              </>
            ) : resendCooldown > 0 ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 opacity-60" />
                Resend link in {resendCooldown}s
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Resend Password Reset Link
              </>
            )}
          </Button>

          {onBackToSignIn ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onBackToSignIn}
              className="w-full text-xs h-9 text-muted-foreground hover:text-foreground gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Sign In
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              className="w-full text-xs h-9 text-muted-foreground hover:text-foreground gap-1.5"
            >
              <Link to="/login">
                <ArrowLeft className="h-3.5 w-3.5" />
                Return to Sign In
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // ===================== UPDATE NEW PASSWORD VIEW =====================
  if (mode === "reset") {
    return (
      <Card className={`border-border/80 bg-card/95 backdrop-blur-sm shadow-md ${className}`}>
        <CardHeader className="space-y-1.5 pb-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-0.5"
            >
              <KeyRound className="h-3 w-3 mr-1 inline" />
              Password Recovery
            </Badge>
            <span className="text-[11px] text-muted-foreground">Supabase Auth</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Set New Password
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Choose a strong, secure password for your KhelGrid sports account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive" className="py-2.5 px-3 text-xs">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-1 text-xs">{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="reset-new-password" className="text-xs font-medium">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-9 pr-9 text-xs h-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reset-confirm-password" className="text-xs font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-9 text-xs font-semibold bg-primary text-primary-foreground gap-2 mt-2 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Save New Password & Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="border-t border-border/60 py-3 text-center">
          {onBackToSignIn ? (
            <button
              type="button"
              onClick={onBackToSignIn}
              className="text-xs text-primary hover:underline mx-auto inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Sign In
            </button>
          ) : (
            <Link
              to="/login"
              className="text-xs text-primary hover:underline mx-auto inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Sign In
            </Link>
          )}
        </CardFooter>
      </Card>
    );
  }

  // ===================== REQUEST RESET EMAIL VIEW =====================
  return (
    <Card className={`border-border/80 bg-card/95 backdrop-blur-sm shadow-md ${className}`}>
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-0.5"
          >
            <KeyRound className="h-3 w-3 mr-1 inline" />
            Account Recovery
          </Badge>
          <span className="text-[11px] text-muted-foreground">Supabase Auth</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your registered email address and we&apos;ll send you instructions to reset your
          password.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" className="py-2.5 px-3 text-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-1 text-xs">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleRequestReset} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="forgot-email" className="text-xs font-medium">
              Registered Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="forgot-email"
                type="email"
                required
                placeholder="athlete@khelgrid.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-9 text-xs font-semibold bg-primary text-primary-foreground gap-2 mt-2 shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Sending Reset Link...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Send Password Reset Link
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/60 py-3 text-xs text-muted-foreground">
        {onBackToSignIn ? (
          <button
            type="button"
            onClick={onBackToSignIn}
            className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Sign In
          </button>
        ) : (
          <Link
            to="/login"
            className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Sign In
          </Link>
        )}

        <span>KhelGrid Security</span>
      </CardFooter>
    </Card>
  );
}

export default ForgotPasswordForm;
