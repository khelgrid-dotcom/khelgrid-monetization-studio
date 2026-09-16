import { createFileRoute } from "@tanstack/react-router";
import { UserProfile } from "@/components/UserProfile";
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <UserProfile />
    </main>
  );
}

export default ProfilePage;
