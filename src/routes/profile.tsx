import { createFileRoute } from "@tanstack/react-router";
import { UserProfile } from "@/components/UserProfile";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/profile")({
  head: () =>
    buildSeoHead({
      title: "Athlete Profile, Sports Achievements & Memberships · KhelGrid",
      description:
        "Manage your sports achievements, view enrolled academy coaching programs, and track membership status on KhelGrid.",
      canonicalPath: "/profile",
      noindex: true,
      type: "website",
    }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <ProtectedRoute message="Sign in to view and manage your verified sports profile and athletic achievements.">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <UserProfile />
      </main>
    </ProtectedRoute>
  );
}

export default ProfilePage;
